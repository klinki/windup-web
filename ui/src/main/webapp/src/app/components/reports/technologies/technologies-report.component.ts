import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router}   from '@angular/router';

import {TechReportService, StatsItem} from "./tech-report.service";

import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from '../../../services/application-group.service';
import {NotificationService} from "../../../services/notification.service";
import {utils} from '../../../utils';
import {ProjectTechnologiesStatsModel} from "../../../generated/tsModels/ProjectTechnologiesStatsModel";
import {forkJoin} from "rxjs/observable/forkJoin";
import {ProjectModel} from "../../../generated/tsModels/ProjectModel";
import {FileModel} from "../../../generated/tsModels/FileModel";
import {TechnologyKeyValuePairModel} from "../../../generated/tsModels/TechnologyKeyValuePairModel";

@Component({
    selector: 'wu-technologies-report',
    templateUrl: 'technologies-report.component.html'
})
export class TechnologiesReportComponent implements OnInit {

    private execID: number;
    private technologiesStats: ProjectTechnologiesStatsModel[] = [];
    private filteredTechnologiesStats;
    private appGroups : ApplicationGroup[];

    constructor(
        private route: ActivatedRoute,
        private techReportService: TechReportService,
        private appGrpService: ApplicationGroupService,
        private _notificationService: NotificationService,
        private _router: Router
    ){}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchTechnologiesStats();
        });

        this.appGrpService.getAll().toPromise().then(appGroups => this.appGroups = appGroups);
    }

    fetchTechnologiesStats(): void {
        this.techReportService.getStats(this.execID).subscribe(
            stats => {
                this.technologiesStats = stats;
                let filteredStats = this.filterTechnologiesStats(stats);
                let mergedStats = this.mergeTechnologyStats(filteredStats);
                mergedStats.fileTypes = this.mergeFileTypesToOne(<any>mergedStats.fileTypes, ['.class', '.java'], 'Java');
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }

    filterTechnologiesStats(techReports: ProjectTechnologiesStatsModel[]) {
        let filter = this.appGroups[0].reportFilter;

        if (!filter.enabled || filter.selectedApplications.length === 0) {
            return techReports;
        }

        let indices = [];

        let rootFileModelObservable = techReports.map((item: ProjectTechnologiesStatsModel) => {
            return item.projectModel.flatMap((projectModel: ProjectModel) => projectModel.rootFileModel);
        });

        forkJoin(rootFileModelObservable).subscribe((rootFileModelArray: FileModel[]) => {
            indices = rootFileModelArray.map((fileModel, index) => {
                let isApplicationSelected = filter.selectedApplications
                    .some(selectedApp => fileModel.fileName === selectedApp.inputFilename);

                if (isApplicationSelected) {
                    return index;
                } else {
                    return -1;
                }
            });

            indices = indices.filter(index => index >= 0);

            this.filteredTechnologiesStats = indices.map(index => techReports[index]);
        });

            /*
            forkJoin(techReports.map(item => item.projectModel))
                .subscribe((projectModelArray: ProjectModel[]) => {
                    forkJoin(projectModelArray.map(projectModel => projectModel.rootFileModel))
                        .subscribe((rootFileModelArray: FileModel[]) => {
                            indices = rootFileModelArray.map((fileModel, index) => {
                                let isApplicationSelected = filter.selectedApplications
                                    .some(selectedApp => fileModel.fileName === selectedApp.inputFilename);

                                if (isApplicationSelected) {
                                    return index;
                                } else {
                                    return -1;
                                }
                            });

                            indices = indices.filter(index => index >= 0);
                        });
                });
            techReports.filter(item => {})
            */
    }

    protected mergeArray(stats: ProjectTechnologiesStatsModel[], result: any, property: string) {
        let propertiesArray = stats.map(item => {
            return item.technologiesStatsModel.flatMap(technologiesStats => {
                return technologiesStats[property];
            });
        });

        console.log(propertiesArray);

        forkJoin(propertiesArray)
            .subscribe((projectTechnologiesArray: TechnologyKeyValuePairModel[][]) => {
                projectTechnologiesArray.forEach(technologiesArray => {
                    technologiesArray.forEach(technology => {
                        if (!result[property].hasOwnProperty(technology.name)) {
                            result[property][technology.name] = 0;
                        }

                        result[property][technology.name] += technology.value;
                    });
                });
            });
    }

    mergeTechnologyStats(stats: ProjectTechnologiesStatsModel[]) {
        let result = {
            technologies: {},
            fileTypes: {}
        };

        this.mergeArray(stats, result, 'technologies');
        this.mergeArray(stats, result, 'fileTypes');

/*
        let propertiesArray = stats.map(item => {
            return item.technologiesStatsModel.flatMap(technologiesStats => technologiesStats.properties);
        });

        console.log(propertiesArray);

        forkJoin(propertiesArray)
            .subscribe((projectTechnologiesArray: TechnologyKeyValuePairModel[][]) => {
                projectTechnologiesArray.forEach(technologiesArray => {
                    technologiesArray.forEach(technology => {
                        if (!result.technologies.hasOwnProperty(technology.name)) {
                            result.technologies[technology.name] = 0;
                        }

                        result.technologies[technology.name] += technology.value;
                    });
                });
            });

        let fileTypes: Observable<TechnologyKeyValuePairModel[]>[] = stats.map(item => {
            return item.technologiesStatsModel.flatMap(technologiesStats => technologiesStats.fileTypes);
        });

        forkJoin(fileTypes)
            .subscribe((projectFileTypeArray: TechnologyKeyValuePairModel[][]) => {
                projectFileTypeArray.forEach(fileTypeArray => {
                    fileTypeArray.forEach(fileType => {
                        if (!result.fileTypes.hasOwnProperty(fileType.name)) {
                            result.fileTypes[fileType.name] = 0;
                        }

                        result.fileTypes[fileType.name] += fileType.value;
                    })
                });
            });
*/
        return result;
    }

    mergeFileTypesToOne(inputValues: TechnologyKeyValuePairModel[], mergedFileTypes: string[], outputFileType: string) {
        let mergedItem = {name: outputFileType, value: 0};

        let outputArray = inputValues.slice(); // make copy of array

        let indicesOfItemsToMerge = outputArray.map((item, index) => {
            if (mergedFileTypes.indexOf(item.name) !== -1) {
                mergedItem.value += item.value;
                return index;
            } else {
                return -1;
            }
        }).filter(index => index >= 0)
            .sort((a, b) => b - a);

        indicesOfItemsToMerge.forEach(index => outputArray.splice(index, 1));

        return outputArray;
    }

    calculateFileTypeUsagePercentage(array: TechnologyKeyValuePairModel[]) {
        let filesCount = array.reduce<number>((previous: number, item: TechnologyKeyValuePairModel) => {
            return previous + item.value;
        }, 0);


    }


    static convertStatsToMap(stats: StatsItem[]) : Map<string, StatsItem> {
        let map = new Map<string, StatsItem>();
        stats.forEach(item => map.set(item.key, item));
        return map;
    }
}
