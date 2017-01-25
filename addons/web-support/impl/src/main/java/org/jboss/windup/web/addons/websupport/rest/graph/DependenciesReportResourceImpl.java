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
import org.jboss.windup.rules.apps.java.archives.model.ArchiveCoordinateModel;
import org.jboss.windup.rules.apps.java.archives.model.IdentifiedArchiveModel;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class DependenciesReportResourceImpl extends AbstractGraphResource implements DependenciesReportResource
{
    @Override
    public Object getDependencies(Long executionId)
    {
        Map<String, Object> reportData = new HashMap<>();
        Map<Long, GraphNode> graphNodes;

        GraphContext graphContext = this.getGraph(executionId);

        Iterable<ArchiveModel> archiveModels = graphContext.findAll(ArchiveModel.class);
        Iterable<IdentifiedArchiveModel> identifiedArchiveModels = graphContext.findAll(IdentifiedArchiveModel.class);
        Iterable<ProjectModel> projectModels = graphContext.findAll(ProjectModel.class);
        Iterable<ProjectDependencyModel> projectDependencies = graphContext.findAll(ProjectDependencyModel.class);

        ArchiveModel singleArchiveModel;
        ProjectModel singleProjectModel;

        Map<ProjectModel, GraphNode> projectModelGraphNodeHashMap = new HashMap<>();
        Set<GraphEdge> edges = new HashSet<>();

        for (IdentifiedArchiveModel identifiedArchive : identifiedArchiveModels)
        {
            this.addIdentifiedArchive(identifiedArchive, projectModelGraphNodeHashMap);
        }

        for (FileModel inputPath : WindupConfigurationService.getConfigurationModel(graphContext).getInputPaths())
        {
            String filePath = inputPath.getFilePath();

            ProjectModel rootProjectModel = inputPath.getProjectModel();

            if (rootProjectModel == null)
            {
                continue;
            }

            GraphNode projectGraphNode = new GraphNode(rootProjectModel.getName(), rootProjectModel, GraphNode.Type.Application);
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

    protected void addIdentifiedArchive(IdentifiedArchiveModel identifiedArchiveModel, Map<ProjectModel, GraphNode> projectsMap)
    {
        Map<String, Object> data = new HashMap<>();

        Map<String, Object> mavenData = new HashMap<>();
        ArchiveCoordinateModel coordinate = identifiedArchiveModel.getCoordinate();

        String name;

        if (coordinate != null) {
            name = coordinate.getArtifactId();

            mavenData.put("artifactId", coordinate.getArtifactId());
            mavenData.put("groupId", coordinate.getGroupId());
            mavenData.put("version", coordinate.getVersion());
            mavenData.put("packaging", coordinate.getPackaging());

            data.put("maven", mavenData);
        } else {
            name = identifiedArchiveModel.getFileName();
        }

        GraphNode graphNode = new GraphNode(
                name,
                data,
                GraphNode.Type.KnownLibrary.name()
        );

        ProjectModel projectModel = identifiedArchiveModel.getProjectModel();

        if (projectModel instanceof DuplicateProjectModel) {
            projectModel = ((DuplicateProjectModel) projectModel).getCanonicalProject();
        }

        projectsMap.put(projectModel, graphNode);
    }

    protected GraphNode addChilds(ProjectModel parentNode, Map<ProjectModel, GraphNode> projectsMap, Set<GraphEdge> edges) {
        GraphNode parentGraphNode;

        if (!projectsMap.containsKey(parentNode)) {
            parentGraphNode = new GraphNode(parentNode.getName(), parentNode, GraphNode.Type.Dependency);
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

    public static class GraphNode
    {
        public enum Type
        {
            Application,
            Dependency
        }

        protected Long id;
        protected String name;
        protected Object data;
        protected Type type;

        protected static long countInstances = 0;

        public GraphNode(String name, Object data, GraphNode.Type type)
        {
            this.id = ++GraphNode.countInstances;
            this.name = name;
            this.data = data;
            this.type = type;
        }

        public Long getId()
        {
            return id;
        }

        public String getName()
        {
            return name;
        }

        public Object getData()
        {
            Map<String, Object> data = new HashMap<>();

            if (this.data instanceof ProjectModel) {
                ProjectModel projectModel = (ProjectModel)this.data;

                FileModel rootFileModel = projectModel.getRootFileModel();

                if (rootFileModel != null) {
                    data.put("filePath", rootFileModel.getFilePath());
                    data.put("fileName", rootFileModel.getFileName());
                }
            }

            return data;
        }

        public Type getType()
        {
            return type;
        }
    }

    public static class GraphEdge
    {
        protected Long from;
        protected Long to;

        public GraphEdge(Long from, Long to)
        {
            this.from = from;
            this.to = to;
        }

        public Long getFrom()
        {
            return from;
        }

        public Long getTo()
        {
            return to;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            GraphEdge graphEdge = (GraphEdge) o;

            if (from != null ? !from.equals(graphEdge.from) : graphEdge.from != null)
                return false;

            return to != null ? to.equals(graphEdge.to) : graphEdge.to == null;
        }

        @Override
        public int hashCode() {
            int result = from != null ? from.hashCode() : 0;
            result = 31 * result + (to != null ? to.hashCode() : 0);

            return result;
        }
    }
}
