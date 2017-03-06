import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RequestOptions, XHRBackend, Http } from '@angular/http';

import 'rxjs/Rx';

import { AppComponent }  from './components/app.component';
import {routing, appRoutingProviders, appRoutes} from './app.routing';

import {ProjectListComponent} from "./project/project-list.component";
import {AnalysisContextFormComponent} from "./analysis-context/analysis-context-form.component";
import {MigrationProjectFormComponent} from "./project/migration-project-form.component";
import {RegisterApplicationFormComponent} from "./registered-application/register-application-form.component";
import {ConfigurationService} from "./configuration/configuration.service";
import {AnalysisContextService} from "./analysis-context/analysis-context.service";
import {FileService} from "./services/file.service";
import {MigrationPathService} from "./analysis-context/migration-path.service";
import {MigrationProjectService} from "./project/migration-project.service";
import {RegisteredApplicationService} from "./registered-application/registered-application.service";
import {WindupService} from "./services/windup.service";
import {RuleService} from "./configuration/rule.service";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {TechnologyComponent} from "./configuration/technology.component";
import {RulesModalComponent} from "./configuration/rules-modal.component";
import {AddRulesPathModalComponent} from "./configuration/add-rules-path-modal.component";
import {CustomRuleSelectionComponent} from "./analysis-context/custom-rule-selection.component";
import {KeycloakService} from "./core/authentication/keycloak.service";
import {WindupHttpService} from "./core/authentication/windup.http.service";
import {EditApplicationFormComponent} from "./registered-application/edit-application-form.component";
import {AnalysisContextAdvancedOptionsModalComponent} from "./analysis-context/analysis-context-advanced-options-modal.component";
import {ConfigurationOptionsService} from "./configuration/configuration-options.service";
import {NotificationService} from "./core/notification/notification.service";
import {PackageRegistryService} from "./analysis-context/package-registry.service";
import {TechnologiesReportComponent} from "./reports/technologies/technologies-report.component";
import {LoginComponent} from "./components/login.component";
import {LoggedInGuard} from "./core/authentication/logged-in.guard";
import {MigrationIssuesComponent} from "./reports/migration-issues/migration-issues.component";
import {MigrationIssuesTableComponent} from "./reports/migration-issues/migration-issues-table.component";
import {MigrationIssuesService} from "./reports/migration-issues/migration-issues.service";
import {TechReportService} from "./reports/technologies/tech-report.service";
import {DependenciesReportComponent} from "./reports/dependencies/dependencies-report.component";
import {DependenciesService} from "./reports/dependencies/dependencies.service";
import {FramesRestClientService} from './services/graph/frames-rest-client.service';
import {ProjectLayoutComponent} from "./project/project-layout.component";
import {DefaultLayoutComponent} from "./shared/layout/default-layout.component";
import {RouteLinkProviderService} from "./core/routing/route-link-provider-service";
import {ConfigurationResolve} from "./configuration/configuration.resolve";
import {ProjectResolve} from "./project/project.resolve";
import {ApplicationResolve} from "./registered-application/application.resolve";
import {RouteFlattenerService} from "./core/routing/route-flattener.service";
import {ExecutionsListComponent} from "./executions/executions-list.component";
import {AllExecutionsComponent} from "./executions/all-executions.component";
import {SourceReportComponent} from "./reports/source/source-report.component";
import {FileModelService} from "./services/graph/file-model.service";
import {ClassificationService} from "./services/graph/classification.service";
import {HintService} from "./services/graph/hint.service";
import {ReportFilterComponent} from "./reports/filter/report-filter.component";
import {ReportFilterService} from "./reports/filter/report-filter.service";
import {ReportFilterResolve} from "./reports/filter/report-filter.resolve";
import {ReportFilterIndicatorComponent} from "./reports/filter/report-filter-indicator.component";
import {ApplicationDetailsComponent} from "./reports/application-details/application-details.component";
import {ApplicationIndexComponent} from "./reports/application-index/application-index.component";
import {AggregatedStatisticsService} from "./reports/application-index/aggregated-statistics.service";
import {ApplicationDetailsService} from "./reports/application-details/application-details.service";
import {TechnologyTagComponent} from "./reports/technology-tag/technology-tag.component";
import {PrettyPathPipe} from "./reports/pretty-path.pipe";
import {EventBusService} from "./core/events/event-bus.service";
import {WindupExecutionService} from "./services/windup-execution.service";
import {ActiveExecutionsProgressbarComponent} from "./executions/active-executions-progressbar.component";
import {TagDataService} from "./reports/tag-data.service";
import {RuleProviderExecutionsService} from "./reports/rule-provider-executions/rule-provider-executions.service";
import {RuleProviderExecutionsComponent} from "./reports/rule-provider-executions/rule-provider-executions.component";
import {initializeModelMappingData} from "./generated/tsModels/discriminator-mapping-data";
import {RouteHistoryService} from "./core/routing/route-history.service";
import {DependenciesGraphComponent} from "./reports/dependencies/dependencies-graph.component";
import {NoProjectsWelcomeComponent} from "./project/no-projects-welcome.component";
import {ExecutionDetailComponent} from "./executions/execution-detail.component";
import {GraphJSONToModelService} from "./services/graph/graph-json-to-model.service";
import {ApplicationListComponent} from "./registered-application/application-list.component";
import {ProjectExecutionsComponent} from "./executions/project-executions.component";
import {SharedModule} from "./shared/shared.module";

/**
 * Load all mapping data from the generated files.
 */
initializeModelMappingData();

@NgModule({
    imports: [
        BrowserModule,

        routing,

        SharedModule
    ],
    declarations: [
        // pages
        AppComponent,
        LoginComponent,
        AnalysisContextFormComponent,
        ConfigurationComponent,
        MigrationProjectFormComponent,
        ProjectListComponent,
        NoProjectsWelcomeComponent,
        RegisterApplicationFormComponent,
        EditApplicationFormComponent,

        // Reports
        TechnologiesReportComponent,
        DependenciesReportComponent,
        SourceReportComponent,
        ApplicationDetailsComponent,
        ApplicationIndexComponent,
        PrettyPathPipe,

        // Report components

        // Components
        AddRulesPathModalComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        RulesModalComponent,
        TechnologyComponent,

        CustomRuleSelectionComponent,
        LoginComponent,
        MigrationIssuesComponent,
        MigrationIssuesTableComponent,
        LoginComponent,
        ProjectLayoutComponent,
        ExecutionsLayoutComponent,
        DefaultLayoutComponent,
        WizardLayoutComponent,
        BreadCrumbsNavigationComponent,
        DefaultLayoutComponent,
        ExecutionsListComponent,
        AllExecutionsComponent,
        ReportFilterComponent,
        ReportFilterIndicatorComponent,
        TechnologyTagComponent,
        ActiveExecutionsProgressbarComponent,
        RuleProviderExecutionsComponent,
        DependenciesGraphComponent,
        ExecutionDetailComponent,
        ApplicationListComponent,
        ProjectExecutionsComponent
    ],
    providers: [
        appRoutingProviders,
        KeycloakService,
        AnalysisContextService,
        ConfigurationService,
        ConfigurationOptionsService,
        FileService,
        MigrationPathService,
        MigrationProjectService,
        RegisteredApplicationService,
        RuleService,
        WindupService,
        NotificationService,
        PackageRegistryService,
        LoggedInGuard,
        MigrationIssuesService,
        TechReportService,
        FileModelService,
        ClassificationService,
        HintService,
        ApplicationDetailsService,
        FramesRestClientService,
        ConfigurationResolve,
        ProjectResolve,
        ApplicationResolve,
        RouteFlattenerService,
        ReportFilterService,
        ReportFilterResolve,
        DependenciesService,
        EventBusService,
        WindupExecutionService,
        TagDataService,
        RuleProviderExecutionsService,
        RouteHistoryService,
        {
            provide: RouteLinkProviderService,
            useFactory: createRouteLinkProviderService
        },
        {
            provide: GraphJSONToModelService,
            useFactory: createGraphJSONToModelService,
            deps: [Http]
        },
        AggregatedStatisticsService
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

export function createRouteLinkProviderService() {
        return new RouteLinkProviderService(appRoutes);
}

export function breadcrumbsServiceFactory(backend: XHRBackend,
                                          defaultOptions: RequestOptions,
                                          keycloakService: KeycloakService) {
    return new WindupHttpService(backend, defaultOptions, keycloakService);
}

export function createGraphJSONToModelService(http: Http) {
    return new GraphJSONToModelService(http, null);
}

export class WINDUP_WEB {
    public static config = {
        // Hide the unfinished features in production mode.
        // TODO: Use process.env.ENV !== 'production' when AOT is fixed.
        // process is not accessible here. Supposedly the references to env vars should be replaced by WebPack but they are not.
        //hideUnfinishedFeatures: (process.env.hideUnfinishedFeatures !== (void 0)) ? process.env.hideUnfinishedFeatures : true;
        hideUnfinishedFeatures: true
    };
}

WINDUP_WEB.config = { hideUnfinishedFeatures: true };
