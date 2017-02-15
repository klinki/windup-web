import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {BreadCrumbsService} from "./navigation/breadcrumbs.service";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {SchedulerService} from "./scheduler.service";
import {SortingService} from "./sort/sorting.service";
import {CustomSelectComponent} from "./custom-select/custom-select.component";
import {DefaultLayoutComponent} from "./layout/default-layout.component";
import {BreadCrumbsComponent} from "./navigation/breadcrumbs.component";
import {ContextMenuComponent} from "./navigation/context-menu.component";
import {PackageChartComponent} from "./package-chart/package-chart.component";
import {UploadProgressbarComponent} from "./upload/upload-progressbar.component";
import {UploadQueueComponent} from "./upload/upload-queue.component";
import {ConfirmationModalComponent} from "./confirmation-modal.component";
import {JsTreeAngularWrapperComponent} from "./js-tree-angular-wrapper.component";
import {ModalDialogComponent} from "./modal-dialog.component";
import {NavbarComponent} from "./navigation/navbar.component";
import {PopoverComponent} from "./popover.component";
import {ProgressBarComponent} from "./progress-bar.component";
import {SearchComponent} from "./search/search.component";
import {SortComponent} from "./sort/sort.component";
import {WizardComponent} from "./wizard/wizard.component";
import {CommonModule} from "@angular/common";
import {LogViewComponent} from "./log-view/log-view.component";
import {SortIndicatorComponent} from "./sort/sort-indicator.component";
import {SortableTableComponent} from "./sort/sortable-table.component";
import {TabContainerComponent} from "./tabs/tab-container.component";
import {TabComponent} from "./tabs/tab.component";
import {DurationPipe} from "./duration.pipe";
import {NotificationComponent} from "./notification.component";
import {RouterModule} from "@angular/router";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {StatusIconComponent} from "./status-icon.component";
import {ChosenModule} from "./chosen/chosen.module";
import {FileUploadModule, FileUploader} from "ng2-file-upload";
import {MomentModule} from "angular2-moment";
import {CheckboxesComponent} from "./checkboxes.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild([]),
        NgxChartsModule,
        ChosenModule,
        FileUploadModule,
        MomentModule
    ],
    providers: [
        BreadCrumbsService,
        ConfirmDeactivateGuard,
        SchedulerService,
        SortingService,
        {
            provide: FileUploader,
            useFactory: createFileUploader
        },
    ],
    declarations: [
        CustomSelectComponent,
        DefaultLayoutComponent,
        LogViewComponent,
        BreadCrumbsComponent,
        ContextMenuComponent,
        NavbarComponent,
        PackageChartComponent,
        SearchComponent,
        SortComponent,
        SortIndicatorComponent,
        SortableTableComponent,
        TabContainerComponent,
        TabComponent,
        WizardComponent,
        UploadProgressbarComponent,
        UploadQueueComponent,
        ConfirmationModalComponent,
        DurationPipe,
        JsTreeAngularWrapperComponent,
        ModalDialogComponent,
        PopoverComponent,
        ProgressBarComponent,
        NotificationComponent,
        StatusIconComponent,
        CheckboxesComponent
    ],
    exports: [
        CustomSelectComponent,
        DefaultLayoutComponent,
        LogViewComponent,
        BreadCrumbsComponent,
        ContextMenuComponent,
        NavbarComponent,
        PackageChartComponent,
        SearchComponent,
        SortComponent,
        SortIndicatorComponent,
        SortableTableComponent,
        TabContainerComponent,
        TabComponent,
        WizardComponent,
        UploadProgressbarComponent,
        UploadQueueComponent,
        ConfirmationModalComponent,
        DurationPipe,
        JsTreeAngularWrapperComponent,
        ModalDialogComponent,
        PopoverComponent,
        ProgressBarComponent,
        NotificationComponent,
        StatusIconComponent,
        CheckboxesComponent,
        
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        NgxChartsModule,
        ChosenModule,
        MomentModule,
        FileUploadModule
    ]
})
export class SharedModule {

}

function createFileUploader() {
    return new FileUploader({});
}
