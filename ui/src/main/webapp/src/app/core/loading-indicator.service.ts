import {Injectable} from "@angular/core";
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {EventBusService} from "./events/event-bus.service";
import {LoadingSomethingFinishedEvent, LoadingSomethingStartedEvent} from "./events/windup-event";
import {Observable} from "rxjs/Observable";
import {LoadingIndicatorComponent} from "../shared/loading-indicator.component";

/**
 * Uses the ng2-slim-loading-bar component to indicate loading progress.
 * See https://www.npmjs.com/package/ng2-slim-loading-bar
 *
 * In our HTTP service wrapper (handling OAuth), we fire an event, which is then caught by our `LoadingIndicatorService`,
 * which wraps the `SlimLoaderBarService`, and keeps track of how many HTTP requests there are in progress.
 * Then it counts the percent and puts it to a scale of 20 to 90 %.
 * When all are done, it stays at 90 % for about a second, and then `complete()` is called.
 */
@Injectable()
export class LoadingIndicatorService {

    constructor(
        private _slimBarService: SlimLoadingBarService,
        private _eventBusService: EventBusService,
    ) {
        // Register the LoadingSomething event listeners.
        this._eventBusService.onEvent
            .filter(event => event.isTypeOf(LoadingSomethingStartedEvent))
            .subscribe((event: LoadingSomethingStartedEvent) => this.loadingStarted(event) )
        this._eventBusService.onEvent
            .filter(event => event.isTypeOf(LoadingSomethingFinishedEvent))
            .subscribe((event: LoadingSomethingFinishedEvent) => this.loadingFinished(event) )
    }

    public getSlimService(){
        return this._slimBarService;
    }


    private counter: number = 0;
    private max: number = void 0;
    private hadError: boolean = false;

    private reset() {
        this.counter = 0;
        this.max = void 0;
        //console.log(`reset(), counter ${this.counter}`);
    }

    public loadingStarted(event: LoadingSomethingStartedEvent){
        this.counter++;
        this.max = this.counter;
        //console.log(`event received START, counter ${this.counter}, max ${this.max}`);
        this.updateProgress();
    }

    public loadingFinished(event: LoadingSomethingFinishedEvent){
        this.counter--;
        // On error, change the bar color to red.
        let res = event.getResponse();
        this.hadError = res.status < 200 || res.status >= 400;
        //console.log(`event received FINISH, counter ${this.counter}, max ${this.max}`);
        this.updateProgress();
    }

    private updateProgress() {
        //console.log(`updateProgress(), counter ${this.counter}, max ${this.max}`);

        // All requests have finished.
        if (this.counter == 0) {
            //console.log("INDI All finished, setting to complete.");

            /*
            this._slimBarService.height = "2px";
            this._slimBarService.visible = true;
            this._slimBarService.progress = 95;
            */
            LoadingIndicatorComponent.visualizeFinished(this._slimBarService, this.hadError);
            Observable.timer(500).subscribe(() => {
                //console.log("INDI All finished, hiding timeout.");
                this._slimBarService.complete();
            });

            this.hadError = false;
            this.max = void 0;
        }
        // Some requests still in progress.
        else {
            // max - counter = finished.
            // If the things to load are added after something has already loaded, the progress goes back.
            // Start at 20, jump to 90.
            let percent = 20 + 70 * (1 - (this.max - this.counter) / this.max);
            //console.log(`INDI Setting bar to ${percent} percent.`);

            /*
            this._slimBarService.height = "3px";
            this._slimBarService.color = this.hadError ? "firebrick" : "#39a5dc";
            this._slimBarService.visible = true;
            */
            LoadingIndicatorComponent.visualizeInProgress(this._slimBarService, this.hadError);

            this._slimBarService.progress = percent;
        }
    }

}
