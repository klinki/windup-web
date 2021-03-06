package org.jboss.windup.web.messaging.executor;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.jms.ConnectionFactory;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.jms.Topic;
import javax.naming.Context;
import javax.naming.InitialContext;

import org.apache.commons.lang3.StringUtils;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class DefaultExecutorBootstrap implements ExecutorBootstrap
{
    public static final String ARGUMENT_NAME = "--messagingExecutor";

    private static final String SHUTDOWN_FILE_NAME = "shutdown.marker";
    private static final String PING_FILE_NAME = "ping";
    private static final String PONG_FILE_NAME = "pong";

    private static Logger LOG = Logger.getLogger(ExecutorBootstrap.class.getName());
    private String user;
    private String password;
    private String hostOrIP;
    private String connectionFactory;
    private String executorQueue;
    private String cancellationTopic;
    private String statusUpdateQueue;
    private String pingDirectory;

    @Inject
    private ExecutorMessageListener executorMessageListener;

    @Inject
    private JMSService jmsService;

    @Inject
    private JavaSEJMSServiceAdapter javaSEJMSServiceAdapter;

    @Override
    public String getName()
    {
        return ARGUMENT_NAME;
    }

    @Override
    public void runServer(String[] arguments)
    {
        LOG.info("Starting with arguments: " + Arrays.asList(arguments));
        parseArguments(arguments);

        final Properties env = new Properties();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "org.jboss.naming.remote.client.InitialContextFactory");
        env.put(Context.PROVIDER_URL, "http-remoting://" + this.hostOrIP + ":8080");
        env.put(Context.SECURITY_PRINCIPAL, this.user);
        env.put(Context.SECURITY_CREDENTIALS, this.password);

        try
        {
            InitialContext remotingCtx = new InitialContext(env);
            ConnectionFactory cf = (ConnectionFactory) remotingCtx.lookup(this.connectionFactory);
            JMSContext context = cf.createContext(this.user, this.password);
            Queue executorQueue = (Queue) remotingCtx.lookup(this.executorQueue);
            Queue statusUpdateQueue = (Queue) remotingCtx.lookup(this.statusUpdateQueue);
            Topic cancellationTopic = (Topic) remotingCtx.lookup(this.cancellationTopic);
            this.javaSEJMSServiceAdapter.init(cf, context, executorQueue, statusUpdateQueue, cancellationTopic);
            this.jmsService.setServiceAdapter(this.javaSEJMSServiceAdapter);
            JMSConsumer consumer = context.createConsumer(executorQueue);
            consumer.setMessageListener(this.executorMessageListener);

            context.start();
            LOG.info("Execution listener started!");

            this.monitorPingDirectory();
        }
        catch (Exception e)
        {
            LOG.log(Level.SEVERE, "Could not start messaging listener due to: " + e.getMessage(), e);
        }
    }

    private void monitorPingDirectory()
    {
        if (StringUtils.isBlank(this.pingDirectory))
        {
            LOG.severe("pingDir not specified... this is required.");
            System.exit(1);
        }
        LOG.info("Setting up ping directory: " + this.pingDirectory);

        Path pingDirPath = Paths.get(this.pingDirectory);
        if (!Files.isDirectory(pingDirPath))
        {
            LOG.fine("Ping directory does not exist, creating!");
            try
            {
                Files.createDirectories(pingDirPath);
                LOG.fine("Ping directory created: " + pingDirPath);
            }
            catch (IOException e)
            {
                LOG.severe("ping directory could not be read or created!");
                System.exit(2);
            }
        }

        Path shutdownPath = pingDirPath.resolve(SHUTDOWN_FILE_NAME);
        Path pingPath = pingDirPath.resolve(PING_FILE_NAME);
        Path pongPath = pingDirPath.resolve(PONG_FILE_NAME);
        while (true)
        {
            if (Files.isRegularFile(shutdownPath))
            {
                LOG.info("Received shutdown request... exiting!");
                try
                {
                    Files.delete(shutdownPath);
                }
                catch (IOException e)
                {
                    LOG.severe("WARN: Failed to delete shutdown marker file due to: " + e.getMessage());
                }
                System.exit(0);
            }

            if (Files.isRegularFile(pingPath))
            {
                LOG.info("Received ping request, responding with pong!");
                try
                {
                    Files.delete(pingPath);
                }
                catch (IOException e)
                {
                    LOG.info("WARN: Failed to delete ping file due to: " + e.getMessage());
                }

                try (FileWriter fileWriter = new FileWriter(pongPath.toFile()))
                {
                    fileWriter.write(String.valueOf(System.currentTimeMillis()));
                }
                catch (IOException e)
                {
                    LOG.info("WARN: Failed to write pong file due to: " + e.getMessage());
                }
            }

            try
            {
                Thread.sleep(250L);
            }
            catch (Throwable t)
            {
                LOG.severe("Sleep interrupted... exiting!");
                System.exit(3);
            }
        }
    }

    private void parseArguments(String[] arguments)
    {
        for (int i = 0; i < arguments.length; i++)
        {
            String argument = arguments[i];
            if (matchArg("user", argument))
            {
                i++;
                this.user = arguments[i];
            }
            else if (matchArg("password", argument))
            {
                i++;
                this.password = arguments[i];
            }
            else if (matchArg("host", argument))
            {
                i++;
                this.hostOrIP = arguments[i];
            }
            else if (matchArg("connectionFactory", argument))
            {
                i++;
                this.connectionFactory = arguments[i];
            }
            else if (matchArg("executorQueue", argument))
            {
                i++;
                this.executorQueue = arguments[i];
            }
            else if (matchArg("statusUpdateQueue", argument))
            {
                i++;
                this.statusUpdateQueue = arguments[i];
            }
            else if (matchArg("cancellationTopic", argument))
            {
                i++;
                this.cancellationTopic = arguments[i];
            }
            else if (matchArg("pingDir", argument))
            {
                i++;
                this.pingDirectory = arguments[i];
            }
        }
    }

    private boolean matchArg(String expected, String argument)
    {
        if (("-" + expected).equals(argument))
            return true;
        else if (("--" + expected).equals(argument))
            return true;
        else
            return false;
    }
}
