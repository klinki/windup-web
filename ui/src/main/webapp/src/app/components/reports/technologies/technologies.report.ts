import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params}   from '@angular/router';

import {TechReportService, StatsItem} from "./TechReportService";

import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from '../../../services/applicationgroup.service';
import {GraphJSONToModelService} from '../../../services/graph/graph-json-to-model.service';
import {DiscriminatorMappingData} from '../../../tsModels/discriminator-mapping-data';
import {TechnologiesStatsModel} from '../../../tsModels/TechnologiesStatsModel';
import {FramesRestClientService} from '../../../services/graph/frames-rest-client.service';
import {Observable} from 'rxjs/Observable';


@Component({
    selector: 'wu-technologies-report',
    templateUrl: 'technologies.report.html'
})
export class TechnologiesReport implements OnInit {

    private execID: number;
    private technologiesStats: TechnologiesStatsModel = <TechnologiesStatsModel> {};
    private appGroups : ApplicationGroup[];

    constructor(
        private route: ActivatedRoute,
        private techReportService: TechReportService,
        private appGrpService: ApplicationGroupService,
        private frameService: FramesRestClientService
    ){}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.execID = +params['exec'];
        });

        this.appGrpService.getAll().toPromise().then(appGroups => this.appGroups = appGroups);

        this.fetchTechnologiesStats();
    }

    fetchTechnologiesStats(): void {
        this.techReportService.getStats(this.execID).subscribe(stats => {
            console.log("Stats: ", stats);
            this.technologiesStats = stats; // [0]
        });
    }


    static convertStatsToMap(stats: StatsItem[]) : Map<string, StatsItem> {
        let map = new Map<string, StatsItem>();
        stats.forEach(item => map.set(item.key, item));
        return map;
    }
}
