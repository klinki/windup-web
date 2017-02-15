import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {MigrationProjectFormComponent} from "./migration-project-form.component";
import {NoProjectsWelcomeComponent} from "./no-projects-welcome.component";
import {ProjectListComponent} from "./project-list.component";
import {MigrationProjectService} from "./migration-project.service";
import {ProjectResolve} from "./project.resolve";
import {SharedModule} from "../shared/shared.module";
import {ExecutionsModule} from "../executions/executions.module";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([])
    ],
    declarations: [
        MigrationProjectFormComponent,
        NoProjectsWelcomeComponent,
        ProjectListComponent
    ],
    exports: [
        MigrationProjectFormComponent,
        ProjectListComponent
    ],
    providers: [
        MigrationProjectService,
        ProjectResolve
    ]
})
export class ProjectModule {
}
