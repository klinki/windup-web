import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {SharedModule} from "../shared/shared.module";
import {ActiveExecutionsProgressbarComponent} from "./active-executions-progressbar.component";
import {AllExecutionsComponent} from "./all-executions.component";
import {ExecutionDetailComponent} from "./execution-detail.component";
import {ExecutionsListComponent} from "./executions-list.component";
import {GroupExecutionsComponent} from "./group-executions.component";
import {ProjectExecutionsComponent} from "./project-executions.component";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([])
    ],
    declarations: [
        ActiveExecutionsProgressbarComponent,
        AllExecutionsComponent,
        ExecutionDetailComponent,
        ExecutionsListComponent,
        GroupExecutionsComponent,
        ProjectExecutionsComponent
    ],
    exports: [
        ActiveExecutionsProgressbarComponent,
        AllExecutionsComponent,
        ExecutionDetailComponent,
        ExecutionsListComponent,
        GroupExecutionsComponent,
        ProjectExecutionsComponent
    ],
    providers: [
    ]
})
export class ExecutionsModule {
}
