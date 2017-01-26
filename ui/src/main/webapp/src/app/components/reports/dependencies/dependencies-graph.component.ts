import {Component, OnInit, Input, OnChanges, SimpleChange} from "@angular/core";
import {DependenciesData, DependencyEdge} from "./dependencies.service";
import * as d3 from "d3";

@Component({
    template: `<svg id="dependencies-graph" width="1000" height="1000"></svg>`,
    selector: 'wu-dependencies-graph',
    styles: [
        ':host /deep/ .application {fill: blue}',
        ':host /deep/ .dependency {fill: red}'
    ]
})
export class DependenciesGraphComponent implements OnInit, OnChanges {

    _dependencies: DependenciesData;

    svg;
    // GElement extends BaseType, Datum, PElement extends BaseType, PDatum

    private edges;
    private nodes;
    private labels;

    constructor() {

    }

    @Input()
    set dependencies(dependencies: DependenciesData) {
        if (dependencies != null) {
            this._dependencies = Object.assign({}, dependencies);
            this._dependencies.edges = <any>this._dependencies.edges.map((edge: DependencyEdge) => {
                return {
                    source: edge.from,
                    target: edge.to
                };
            });
        }
    }

    ngOnInit(): void {
        this.svg = d3.select('#dependencies-graph');
    }

    // changes: {configuration: SimpleChange, selection: SimpleChange, options: SimpleChange}
    ngOnChanges(changes: {dependencies: SimpleChange}): void {
        if (changes.dependencies.currentValue && changes.dependencies.currentValue !== changes.dependencies.previousValue) {
            let width = +this.svg.attr("width"),
                height = +this.svg.attr("height");

            let edges = this.svg.selectAll(".edge");
            let nodes = this.svg.selectAll(".node");
            let labels = this.svg.selectAll('text');

            let ticked = () => {
                this.edges.attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)
                    .attr("stroke", "grey");

                this.nodes.attr("cx", d => d.x)
                    .attr("cy", d => d.y);

                this.labels.attr('x', d => d.x)
                    .attr('y', d => d.y - 10);
            };

            let simulation = d3.forceSimulation()
                .force("charge", d3.forceManyBody().strength(-200))
                .force("link", d3.forceLink().id((d: {id: string}) => {
                    return d.id;
                }).distance(200))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force("x", d3.forceX(width / 2))
                .force("y", d3.forceY(height / 2))
                .on("tick", ticked);

            simulation.nodes(this._dependencies.nodes);
            (<any>simulation.force('link')).links(this._dependencies.edges);

            this.edges = edges
                .data(this._dependencies.edges)
                .enter()
                .append("line")
                .attr("class", "link");

            this.nodes = nodes
                .data(this._dependencies.nodes)
                .enter()
                .append("circle")
                .classed('node', true)
                .classed('application', d => d.type === 'Application')
                .classed('dependency', d => d.type === 'Dependency')
                .attr("r", 6)
                .style("fill", d => d.id);

            this.labels = labels
                .data(this._dependencies.nodes)
                .enter()
                .append('text')
                .text(d => d.name)
                .style('text-anchor', 'middle');
        }
    }
}
