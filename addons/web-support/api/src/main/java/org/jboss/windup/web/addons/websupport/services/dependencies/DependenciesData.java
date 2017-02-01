package org.jboss.windup.web.addons.websupport.services.dependencies;

import java.util.HashSet;
import java.util.Set;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class DependenciesData
{
    private Set<GraphEdge> edges;
    private Set<GraphNode> nodes;

    public DependenciesData()
    {
        this.edges = new HashSet<>();
        this.nodes = new HashSet<>();
    }

    public Set<GraphEdge> getEdges()
    {
        return edges;
    }

    public void setEdges(Set<GraphEdge> edges)
    {
        this.edges = edges;
    }

    public DependenciesData addEdge(GraphEdge edge)
    {
        this.edges.add(edge);

        return this;
    }

    public Set<GraphNode> getNodes()
    {
        return nodes;
    }

    public void setNodes(Set<GraphNode> nodes)
    {
        this.nodes = nodes;
    }

    public DependenciesData addNode(GraphNode node)
    {
        this.nodes.add(node);

        return this;
    }
}
