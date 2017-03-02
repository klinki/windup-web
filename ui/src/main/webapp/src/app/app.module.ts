import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http } from '@angular/http';

import 'rxjs/Rx';

import { AppComponent }  from './components/app.component';
import {routing, appRoutingProviders} from './app.routing';

import {RegisterApplicationFormComponent} from "./registered-application/register-application-form.component";
import {FileService} from "./services/file.service";
import {RegisteredApplicationService} from "./registered-application/registered-application.service";
import {WindupService} from "./services/windup.service";
import {EditApplicationFormComponent} from "./registered-application/edit-application-form.component";
import {FramesRestClientService} from './services/graph/frames-rest-client.service';
import {ApplicationResolve} from "./registered-application/application.resolve";
import {FileModelService} from "./services/graph/file-model.service";
import {ClassificationService} from "./services/graph/classification.service";
import {HintService} from "./services/graph/hint.service";
import {WindupExecutionService} from "./services/windup-execution.service";
import {initializeModelMappingData} from "./generated/tsModels/discriminator-mapping-data";
import {GraphJSONToModelService} from "./services/graph/graph-json-to-model.service";
import {LoginComponent} from "./components/login.component";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";
import {ReportsModule} from "./reports/reports.module";
import {AnalysisContextModule} from "./analysis-context/analysis-context.module";
import {ConfigurationModule} from "./configuration/configuration.module";
import {GroupModule} from "./group/group.module";
import {ProjectModule} from "./project/project.module";
import {ExecutionsModule} from "./executions/executions.module";

/**
 * Load all mapping data from the generated files.
 */
initializeModelMappingData();

@NgModule({
    imports: [
        BrowserModule,

        routing,

        SharedModule,
        CoreModule,
        ReportsModule,
        AnalysisContextModule,
        ConfigurationModule,
        GroupModule,
        ProjectModule,
        ExecutionsModule
    ],
    declarations: [
        // pages
        AppComponent,
        LoginComponent,
        RegisterApplicationFormComponent,
        EditApplicationFormComponent
    ],
    providers: [
        appRoutingProviders,
        FileService,
        RegisteredApplicationService,
        WindupService,
        FileModelService,
        ClassificationService,
        HintService,
        FramesRestClientService,
        ApplicationResolve,
        WindupExecutionService,
        {
            provide: GraphJSONToModelService,
            useFactory: createGraphJSONToModelService,
            deps: [Http]
        },
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

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
