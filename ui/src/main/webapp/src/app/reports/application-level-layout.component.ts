import {Component, OnInit} from "@angular/core";
import {ExecutionsLayoutComponent} from "../executions/executions-layout.component";
import {WindupExecution, RegisteredApplication} from "windup-services";
import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {WindupService} from "../services/windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {FilterApplication} from "windup-services";

type Application = any; //RegisteredApplication|FilterApplication;

@Component({
    templateUrl: './application-level-layout.component.html'
})
export class ApplicationLevelLayoutComponent extends ExecutionsLayoutComponent implements OnInit {
    public allApplications: (RegisteredApplication|FilterApplication)[];
    public application: RegisteredApplication|FilterApplication;

    constructor(
        _router: Router,
        _activatedRoute: ActivatedRoute,
        _routeFlattenerService: RouteFlattenerService,
        _routeLinkProviderService: RouteLinkProviderService,
        _migrationProjectService: MigrationProjectService,
        _eventBus: EventBusService,
        _windupService: WindupService,
        _datePipe: DatePipe
    ) {
        super(
            _router,
            _activatedRoute,
            _routeFlattenerService,
            _routeLinkProviderService,
            _migrationProjectService,
            _eventBus,
            _windupService,
            _datePipe
        );
    }


    ngOnInit(): void {
        super.ngOnInit();
        this.flatRouteLoaded.subscribe(data => {
            this.allApplications = this.execution.filterApplications;
        });
    }

    public getApplicationLabel = (application: Application): string => {
        return application.fileName;
    };

    public getApplicationRoute = (application: Application): any[] => {
        return application ? ['/projects', this.project.id, 'reports', this.execution.id, 'applications', application.id] : null;
    };

    public navigateToApplication = (application: Application) => {
        this._router.navigate(this.getApplicationRoute(application));
    };
}
