package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.ArchiveModel;
import org.jboss.windup.graph.model.DuplicateProjectModel;
import org.jboss.windup.graph.model.ProjectDependencyModel;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.WindupConfigurationService;
import org.jboss.windup.web.addons.websupport.services.TechnologiesDependenciesService;
import org.jboss.windup.web.addons.websupport.services.dependencies.GraphEdge;
import org.jboss.windup.web.addons.websupport.services.dependencies.GraphNode;

import javax.inject.Inject;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class DependenciesReportResourceImpl extends AbstractGraphResource implements DependenciesReportResource
{
    @Inject
    TechnologiesDependenciesService dependenciesService;

    @Override
    public Object getDependencies(Long executionId)
    {
        Map<String, Object> reportData = new HashMap<>();
        Map<Long, GraphNode> graphNodes;

        GraphContext graphContext = this.getGraph(executionId);

        Iterable<ArchiveModel> archiveModels = graphContext.findAll(ArchiveModel.class);
        Iterable<ProjectModel> projectModels = graphContext.findAll(ProjectModel.class);
        Iterable<ProjectDependencyModel> projectDependencies = graphContext.findAll(ProjectDependencyModel.class);

        ArchiveModel singleArchiveModel;
        ProjectModel singleProjectModel;

        Map<ProjectModel, GraphNode> projectModelGraphNodeHashMap = new HashMap<>();
        Set<GraphEdge> edges = new HashSet<>();

        for (FileModel inputPath : WindupConfigurationService.getConfigurationModel(graphContext).getInputPaths())
        {
            String filePath = inputPath.getFilePath();

            ProjectModel rootProjectModel = inputPath.getProjectModel();

            if (rootProjectModel == null)
            {
                continue;
            }

            GraphNode projectGraphNode = new GraphNode(
                    rootProjectModel.getName(),
                    this.getData(rootProjectModel),
                    GraphNode.Type.Application.name()
            );

            projectModelGraphNodeHashMap.put(rootProjectModel, projectGraphNode);

            this.addChilds(rootProjectModel, projectModelGraphNodeHashMap, edges);

//            ProjectModelTraversal traversal = new ProjectModelTraversal(rootProjectModel);
//            projectModels.addAll(traversal.getAllProjects(true));
        }

        for (ProjectDependencyModel projectDependencyModel : projectDependencies)
        {
            // reportData.putIfAbsent(projectDependencyModel)
        }

        reportData.put("nodes", projectModelGraphNodeHashMap.values());
        reportData.put("edges", edges);

        return reportData;
    }

    @Override
    public Object getTechnologiesDependencies(Long executionId) {
        GraphContext graphContext = this.getGraph(executionId);
        this.dependenciesService.setGraphContext(graphContext);

        return this.dependenciesService.getDependencies();
    }

    protected GraphNode addChilds(ProjectModel parentNode, Map<ProjectModel, GraphNode> projectsMap, Set<GraphEdge> edges) {
        GraphNode parentGraphNode;

        if (!projectsMap.containsKey(parentNode)) {
            parentGraphNode = new GraphNode(parentNode.getName(), this.getData(parentNode), GraphNode.Type.Dependency.name());
            projectsMap.put(parentNode, parentGraphNode);
        }

        parentGraphNode = projectsMap.get(parentNode);

        for (ProjectModel child : parentNode.getChildProjects())
        {
            if (child instanceof DuplicateProjectModel) {
                child = ((DuplicateProjectModel) child).getCanonicalProject();
            }

            GraphNode childGraphNode = this.addChilds(child, projectsMap, edges);
            edges.add(new GraphEdge(parentGraphNode.getId(), childGraphNode.getId()));
        }

        return parentGraphNode;
    }


    protected Map<String, Object> getData(Object model)
    {
        Map<String, Object> data = new HashMap<>();

        if (model instanceof ProjectModel)
        {
            ProjectModel projectModel = (ProjectModel) model;

            FileModel rootFileModel = projectModel.getRootFileModel();

            if (rootFileModel != null)
            {
                data.put("filePath", rootFileModel.getFilePath());
                data.put("fileName", rootFileModel.getFileName());
            }
        }

        return data;
    }
}
