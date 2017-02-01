package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.graph.GraphContext;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public interface TechnologiesDependenciesService
{
    void setGraphContext(GraphContext context);

    Object getJMQDependencies();

    Object getDataSourceDependencies();

    Object getWSDependencies();
}
