import {AbstractService} from "../../../services/abtract.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Constants} from "../../../constants";

@Injectable()
export class DependenciesService extends AbstractService {
    private GET_DEPENDENCIES_URL = Constants.GRAPH_REST_BASE +  '/graph/{executionId}/dependencies';

    constructor (private _http: Http) {
        super();
    }

    public getDependencies(executionId: number): Observable<any> {
        let url = this.GET_DEPENDENCIES_URL.replace('{executionId}', executionId.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }
}

export interface DependencyNode {
    id: number;
    name: string;
}

export interface DependencyEdge {
    from: number;
    to: number;
}

export interface DependenciesData {
    nodes: DependencyNode[];
    edges: DependencyEdge[];
}

