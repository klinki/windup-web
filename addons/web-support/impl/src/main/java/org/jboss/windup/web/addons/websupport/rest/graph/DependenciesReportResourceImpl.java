package org.jboss.windup.web.addons.websupport.rest.graph;

import javax.inject.Inject;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.web.addons.websupport.services.dependencies.LibraryDependenciesService;
import org.jboss.windup.web.addons.websupport.services.dependencies.TechnologiesDependenciesService;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class DependenciesReportResourceImpl extends AbstractGraphResource implements DependenciesReportResource
{
    @Inject
    TechnologiesDependenciesService dependenciesService;

    @Inject
    LibraryDependenciesService libraryDependenciesService;

    @Override
    public Object getDependencies(Long executionId)
    {
        GraphContext graphContext = this.getGraph(executionId);
        this.libraryDependenciesService.setGraphContext(graphContext);

        return this.libraryDependenciesService.getDependencies();
    }

    @Override
    public Object getTechnologiesDependencies(Long executionId) {
        GraphContext graphContext = this.getGraph(executionId);
        this.dependenciesService.setGraphContext(graphContext);

        return this.dependenciesService.getDependencies();
    }
}
