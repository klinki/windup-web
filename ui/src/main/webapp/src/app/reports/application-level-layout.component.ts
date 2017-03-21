import {Component} from "@angular/core";
import {ExecutionsLayoutComponent} from "../executions/executions-layout.component";
import {WindupExecution, RegisteredApplication} from "windup-services";
import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {WindupService} from "../services/windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
    templateUrl: './application-level-layout.component.html'
})
export class ApplicationLevelLayoutComponent extends ExecutionsLayoutComponent {
    public allApplications: RegisteredApplication[];
    public application: RegisteredApplication;

    constructor(
        _activatedRoute: ActivatedRoute,
        _routeLinkProviderService: RouteLinkProviderService,
        _migrationProjectService: MigrationProjectService,
        _eventBus: EventBusService,
        _router: Router,
        _windupService: WindupService,
        _datePipe: DatePipe
    ) {
        super(_activatedRoute, _routeLinkProviderService, _migrationProjectService, _eventBus, _router, _windupService, _datePipe);
    }

    public getApplicationLabel = (execution: WindupExecution): string => {
        return execution ? this._datePipe.transform(execution.timeStarted, 'short') : '';
    };

    public getApplicationRoute = (execution: WindupExecution): any[] => {
        return execution ? ['/projects', this.project.id, 'reports', execution.id] : null;
    };

    public navigateToApplication = (execution: WindupExecution) => {
        this._router.navigate(this.getExecutionRoute(execution));
    };
}
