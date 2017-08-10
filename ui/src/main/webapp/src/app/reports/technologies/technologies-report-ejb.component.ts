import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router}   from '@angular/router';

import {TechReportService, StatsItem} from "./tech-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {ResolvedObject, utils} from '../../shared/utils';
import {ProjectTechnologiesStatsModel} from "../../generated/tsModels/ProjectTechnologiesStatsModel";
import {forkJoin} from "rxjs/observable/forkJoin";
import {ProjectModel} from "../../generated/tsModels/ProjectModel";
import {FileModel} from "../../generated/tsModels/FileModel";
import {TechnologyKeyValuePairModel} from "../../generated/tsModels/TechnologyKeyValuePairModel";
import {FilterApplication, RegisteredApplication} from "../../generated/windup-services";
import {EjbMessageDrivenModel} from "../../generated/tsModels/EjbMessageDrivenModel";
import {Observable} from "rxjs/Observable";
import {JavaClassFileModel} from "../../generated/tsModels/JavaClassFileModel";
import {JavaClassModel} from "../../generated/tsModels/JavaClassModel";
import {EjbSessionBeanModel} from "../../generated/tsModels/EjbSessionBeanModel";
import {EjbEntityBeanModel} from "../../generated/tsModels/EjbEntityBeanModel";
import Observables = utils.Observables;
import nullCoalesce = utils.nullCoalesce;

type ResolvedEjbSessionBeanModel = ResolvedObject<EjbSessionBeanModel, 'ejbLocal' | 'ejbRemote' | 'ejbClass' | 'globalJndiReference'>;
type ResolvedEjbMessageDrivenModel = ResolvedObject<EjbMessageDrivenModel, 'destination' | 'ejbClass'>;
type ResolvedEjbEntityBeanModel = ResolvedObject<EjbEntityBeanModel, 'ejbLocal' | 'ejbRemote' | 'ejbClass'>;

@Component({
    selector: 'wu-technologies-report-ejb',
    templateUrl: 'technologies-report-ejb.component.html',
    styleUrls: ['./technologies-report-ejb.component.scss']
})
export class TechnologiesEJBReportComponent implements OnInit {

    private execID: number;
    private reportId: Observable<string>;

    private ejbMessageDriven: ResolvedEjbMessageDrivenModel[] = [];
    private filteredEjbMessageDriven : ResolvedEjbMessageDrivenModel[] = [];
    private sortedEjbMessageDriven : ResolvedEjbMessageDrivenModel[] = [];

    private ejbSessionStatelessBean: ResolvedEjbSessionBeanModel[] = [];
    private filteredEjbSessionStatelessBean: ResolvedEjbSessionBeanModel[] = [];
    private sortedEjbSessionStatelessBean: ResolvedEjbSessionBeanModel[] = [];

    private ejbSessionStatefulBean: ResolvedEjbSessionBeanModel[] = [];
    private filteredEjbSessionStatefulBean: ResolvedEjbSessionBeanModel[] = [];
    private sortedEjbSessionStatefulBean: ResolvedEjbSessionBeanModel[] = [];

    private ejbEntityBean: ResolvedEjbEntityBeanModel[] = [];
    private filteredEjbEntityBean: ResolvedEjbEntityBeanModel[] = [];
    private sortedEjbEntityBean: ResolvedEjbEntityBeanModel[] = [];

    public searchText: string;

    private fake: number = 0;

    constructor(
        private route: ActivatedRoute,
        private techReportService: TechReportService,
        private _notificationService: NotificationService,
        private _router: Router
    ){}

    ngOnInit(): void {
        this.route.parent.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchEJBData();
        });
        this.route.params.forEach((params: Params) => {
            this.reportId = params['report_id'];
        });
    }

    fetchEJBData(): void {
        Observables.resolveValuesArray(this.techReportService.getEjbMessageDrivenModel(this.execID), ['ejbClass', 'destination']).subscribe(
            value => {
                this.ejbMessageDriven = value;
                this.filteredEjbMessageDriven = this.ejbMessageDriven;
                this.sortedEjbMessageDriven = this.ejbMessageDriven;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );

        Observables.resolveValuesArray(this.techReportService.getEjbSessionBeanModel(this.execID, 'Stateless'),
            ['ejbLocal', 'ejbRemote', 'ejbClass', 'globalJndiReference']).subscribe(
            value => {
                this.ejbSessionStatelessBean = value;
                this.filteredEjbSessionStatelessBean = this.ejbSessionStatelessBean;
                this.sortedEjbSessionStatelessBean = this.ejbSessionStatelessBean;

            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );

        Observables.resolveValuesArray(this.techReportService.getEjbSessionBeanModel(this.execID, 'Stateful'),
            ['ejbLocal', 'ejbRemote', 'ejbClass', 'globalJndiReference']).subscribe(
            value => {
                this.ejbSessionStatefulBean = value;
                this.filteredEjbSessionStatefulBean = this.ejbSessionStatefulBean;
                this.sortedEjbSessionStatefulBean = this.ejbSessionStatefulBean;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );

        Observables.resolveValuesArray(this.techReportService.getEjbEntityBeanModel(this.execID),
            ['ejbLocal', 'ejbRemote', 'ejbClass']).subscribe(
            value => {
                this.ejbEntityBean = value;
                this.filteredEjbEntityBean = this.ejbEntityBean;
                this.sortedEjbEntityBean = this.ejbEntityBean;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );

    }

    updateSearch() {
        if (this.searchText && this.searchText.length > 0) {
            const regex = new RegExp(this.searchText, 'i');

            this.filteredEjbMessageDriven = this.ejbMessageDriven.filter(mdb => {
                return mdb.beanName.search(regex) !== -1
                    || mdb.resolved.destination.jndiLocation.search(regex) !== -1
                    || mdb.resolved.ejbClass.qualifiedName.search(regex) !== -1;
            });

            const filterEjbSessionBean = (ejb: ResolvedEjbSessionBeanModel) => {
                return ejb.beanName.search(regex) !== -1
                    || nullCoalesce(ejb.resolved.ejbLocal, '', 'qualifiedName').search(regex) !== -1
                    || nullCoalesce(ejb.resolved.ejbRemote, '', 'qualifiedName').search(regex) !== -1
                    || nullCoalesce(ejb.resolved.ejbClass, '', 'qualifiedName').search(regex) !== -1
                    || nullCoalesce(ejb.resolved.globalJndiReference, '', 'jndiLocation').search(regex) !== -1;
            };

            this.filteredEjbSessionStatelessBean = this.ejbSessionStatelessBean.filter(ejb => filterEjbSessionBean(ejb));
            this.filteredEjbSessionStatefulBean = this.ejbSessionStatefulBean.filter(ejb => filterEjbSessionBean(ejb));
            this.filteredEjbEntityBean = this.ejbEntityBean.filter(ejb => {
                return ejb.beanName.search(regex) !== -1
                    || nullCoalesce(ejb.resolved.ejbLocal, '', 'qualifiedName').search(regex) !== -1
                    || nullCoalesce(ejb.resolved.ejbRemote, '', 'qualifiedName').search(regex) !== -1
                    || nullCoalesce(ejb.resolved.ejbClass, '', 'qualifiedName').search(regex) !== -1;
            });
        } else {
            this.filteredEjbMessageDriven = this.ejbMessageDriven;
            this.filteredEjbSessionStatelessBean = this.ejbSessionStatelessBean;
            this.filteredEjbSessionStatefulBean = this.ejbSessionStatefulBean;
            this.filteredEjbEntityBean = this.ejbEntityBean;
        }
    }

    clearSearch() {
        this.searchText = '';
        this.updateSearch();
    }



    sortByQualifiedNameCallback = (item: ResolvedEjbMessageDrivenModel) : string => {
        return item.resolved.ejbClass.simpleName;
    };
}
