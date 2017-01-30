package org.jboss.windup.web.addons.websupport.services.dependencies;

import java.util.HashMap;
import java.util.Map;

import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.resource.FileModel;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class GraphNode
{
    public enum Type
    {
        Application,
        Dependency
    }

    protected Long id;
    protected String name;
    protected Map<String, Object> data;
    protected String type;

    protected static long countInstances = 0;

    public GraphNode(String name, Map<String, Object> data, String type)
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
        return data;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public void setData(Map<String, Object> data)
    {
        this.data = data;
    }

    public void setType(String type)
    {
        this.type = type;
    }

    public String getType()
    {
        return type;
    }
}
