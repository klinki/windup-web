package org.jboss.windup.web.addons.websupport.tsmodelgen;

import java.util.EnumSet;
import org.apache.commons.lang3.StringUtils;
import static org.jboss.windup.web.addons.websupport.tsmodelgen.TsGenUtils.quoteIfNotNull;

/**
 * A relation between WinudpVertexFrame's.
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
class ModelRelation extends ModelMember
{
    String edgeLabel;
    String query;
    boolean directionOut;

    public ModelRelation(String name, String edgeLabel, boolean directionOut, ModelType type, boolean iterable) {
        this.beanPropertyName = name;
        this.edgeLabel = edgeLabel;
        this.directionOut = directionOut;
        this.type = type;
        this.isIterable = iterable;
    }

    ModelRelation() {
    }

    /**
     * Query that is passed to the REST API to limit the set of returned objects.
     */
    public ModelRelation setQuery(String query) {
        this.query = query;
        return this;
    }

    public EnumSet<BeanMethodType> getMethodsPresent() {
        return methodsPresent;
    }

    public ModelType getType() {
        return type;
    }

    String toTypeScript(TypeScriptModelsGeneratorConfig.AdjacencyMode mode) {
        switch (mode) {
            case PROXIED:
                return toTypeScriptProxy();
            case MATERIALIZED:
                return toTypeScriptMaterialized();
            case DECORATED:
                return toTypeScriptDecorated();
            default:
                throw new UnsupportedOperationException();
        }
    }

    String toTypeScriptMaterialized() {
        String brackets = this.isIterable ? "[]" : "";
        return "    public " + this.beanPropertyName + ": " + this.type.getTypeScriptTypeName() + brackets + "; // edge label '" + this.edgeLabel + "'\n";
    }

    String toTypeScriptDecorated() {
        String brackets = this.isIterable ? "[]" : "";
        StringBuilder sb = new StringBuilder();
        String direction = this.directionOut ? "'OUT'" : "'IN'";
        sb.append(String.format("    @GraphAdjacency(%s, %s, %b)\n", quoteIfNotNull(this.edgeLabel), direction, this.isIterable));
        sb.append(String.format("    get %s(): Observable<%s%s> { return null };\n", this.beanPropertyName, this.type.getTypeScriptTypeName(), brackets));
        return sb.toString();
    }

    String toTypeScriptProxy() {
        String brackets = this.isIterable ? "[]" : "";
        // A method calling a service to get the adjacent items.
        StringBuilder sb = new StringBuilder();
        sb.append("    function get").append(StringUtils.capitalize(this.beanPropertyName)).append("(): ").append(this.type.getTypeScriptTypeName()).append(brackets).append(" {\n");
        sb.append("        return this.queryAdjacent('").append(this.edgeLabel).append("', ");
        quoteIfNotNull(sb, this.query);
        sb.append(");\n");
        sb.append("    }\n\n");
        // A method calling a service to set the given adjacent item.
        sb.append("    function set").append(StringUtils.capitalize(this.beanPropertyName)).append("(item: ").append(this.type.getTypeScriptTypeName()).append(brackets).append(") {\n");
        sb.append("        return this.set('").append(this.edgeLabel).append("', item);\n");
        sb.append("    }\n\n");
        if (this.isIterable) {
            // A method calling a service to add the adjacent items.
            sb.append("    function add").append(StringUtils.capitalize(this.beanPropertyName)).append("(item: ").append(this.type.getTypeScriptTypeName()).append(") {\n");
            sb.append("        return this.add('").append(this.edgeLabel).append("', item);\n");
            sb.append("    }\n\n");
            // A method calling a service to remove the adjacent items.
            sb.append("    function remove").append(StringUtils.capitalize(this.beanPropertyName)).append("(item: ").append(this.type.getTypeScriptTypeName()).append(") {\n");
            sb.append("        return this.remove('").append(this.edgeLabel).append("', item);\n");
            sb.append("    }\n\n");
        }
        return sb.toString();
    }

    @Override
    public String toString() {
        return "Relation{" + "edge: " + edgeLabel + ", name: " + beanPropertyName + ", type: " + (type == null ? "null" : type.getTypeScriptTypeName()) + (this.isIterable ? "[]" : "") + '}';
    }

}
