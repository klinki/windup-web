package org.jboss.windup.web.services.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.io.Serializable;
import java.nio.file.Paths;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;

/**
 * Contains the current execution status for a Windup run.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = WindupExecution.class)
public class WindupExecution implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String WINDUP_EXECUTION_ID = "windup_execution_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = WINDUP_EXECUTION_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @ManyToOne
    @JsonIgnore
    private ApplicationGroup group;

    @Column(name = "time_started")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar timeStarted;

    @Column(name = "time_completed")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar timeCompleted;

    @Column(name = "output_path")
    private String outputPath;

    @Column(name = "total_work")
    private int totalWork;

    @Column(name = "work_completed")
    private int workCompleted;

    @Column(name = "current_task")
    private String currentTask;

    @Column(name = "status")
    private ExecutionState state;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public int getVersion()
    {
        return version;
    }

    public void setVersion(int version)
    {
        this.version = version;
    }

    /**
     * Contains the {@link ApplicationGroup} being analyzed.
     */
    public ApplicationGroup getGroup()
    {
        return group;
    }

    /**
     * Contains the {@link ApplicationGroup} being analyzed.
     */
    public void setGroup(ApplicationGroup group)
    {
        this.group = group;
    }

    /**
     * Contains the path to the output directory for windup (containing the reports and graph data).
     */
    public String getOutputPath()
    {
        return outputPath;
    }

    /**
     * Contains the path to the output directory for windup (containing the reports and graph data).
     */
    public void setOutputPath(String outputPath)
    {
        this.outputPath = outputPath;
    }

    /**
     * Gets the directory name of the output as computed from the full path.
     */
    public String getOutputDirectoryName()
    {
        if (getOutputPath() == null)
            return null;

        return Paths.get(getOutputPath()).getFileName().toString();
    }

    /**
     * This should never be called directory (it is only here to aid in Jackson serialization).
     */
    public void setOutputDirectoryName(String dirName)
    {
        // noop
    }

    /**
     * Gets the relative path to the application list in a format suitable for a URL.
     */
    public String getApplicationListRelativePath()
    {
        String directoryName = getOutputDirectoryName();
        if (directoryName == null)
            return null;

        return directoryName + "/index.html";
    }

    /**
     * This should never be called directory (it is only here to aid in Jackson serialization).
     */
    public void setApplicationListRelativePath(String path)
    {
        // nooop
    }

    /**
     * Contains the time that this execution run was started.
     */
    public Calendar getTimeStarted()
    {
        return timeStarted;
    }

    /**
     * Contains the time that this execution run was started.
     */
    public void setTimeStarted(Calendar timeStarted)
    {
        this.timeStarted = timeStarted;
    }

    /**
     * Contains the time that this execution run was completed.
     */
    public Calendar getTimeCompleted()
    {
        return timeCompleted;
    }

    /**
     * Contains the time that this execution run was completed.
     */
    public void setTimeCompleted(Calendar timeCompleted)
    {
        this.timeCompleted = timeCompleted;
    }

    /**
     * Contains the total number of units of work that must be executed.
     */
    public int getTotalWork()
    {
        return totalWork;
    }

    /**
     * Contains the total number of units of work that must be executed.
     */
    public void setTotalWork(int totalWork)
    {
        this.totalWork = totalWork;
    }

    /**
     * Contains the number of units of work that have been executed.
     */
    public int getWorkCompleted()
    {
        return workCompleted;
    }

    /**
     * Contains the number of units of work that have been executed.
     */
    public void setWorkCompleted(int workCompleted)
    {
        this.workCompleted = workCompleted;
    }

    /**
     * Contains the name of the current task being executed.
     */
    public String getCurrentTask()
    {
        return currentTask;
    }

    /**
     * Contains the name of the current task being executed.
     */
    public void setCurrentTask(String currentTask)
    {
        this.currentTask = currentTask;
    }

    /**
     * Contains the status of execution (currently being executed or completed, etc).
     */
    public ExecutionState getState()
    {
        return state;
    }

    /**
     * Contains the status of execution (currently being executed or completed, etc).
     */
    public void setState(ExecutionState status)
    {
        this.state = status;
    }
}