import {NgModule} from "@angular/core";
import {ApplicationGroupForm} from "./application-group-form.component";
import {GroupPageComponent} from "./group.page.component";
import {GroupListComponent} from "./group-list.component";
import {ApplicationGroupService} from "./application-group.service";
import {ApplicationGroupResolve} from "./application-group.resolve";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {GroupLayoutComponent} from "./group-layout.component";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([])
    ],
    declarations: [
        ApplicationGroupForm,
        GroupPageComponent,
        GroupListComponent,
        GroupLayoutComponent
    ],
    exports: [
        ApplicationGroupForm,
        GroupPageComponent,
        GroupListComponent,
        GroupLayoutComponent
    ],
    providers: [
        ApplicationGroupService,
        ApplicationGroupResolve
    ]
})
export class GroupModule {
}
