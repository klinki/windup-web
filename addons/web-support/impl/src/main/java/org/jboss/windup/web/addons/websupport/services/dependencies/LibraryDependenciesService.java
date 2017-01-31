package org.jboss.windup.web.addons.websupport.services.dependencies;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.ArchiveModel;
import org.jboss.windup.graph.model.ProjectDependencyModel;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.WindupConfigurationService;
import org.jboss.windup.rules.apps.java.archives.model.IdentifiedArchiveModel;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class LibraryDependenciesService implements DependenciesService
{
    private GraphContext graphContext;

    @Override
    public void setGraphContext(GraphContext graphContext)
    {

    }

    @Override
    public DependenciesData getDependencies()
    {
        return null;
    }
}
