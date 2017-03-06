import {Component, OnInit, Input, ElementRef, SimpleChange, Output, EventEmitter, NgZone, OnChanges} from "@angular/core";
import * as $ from "jquery";
import {isFunction} from "util";

export type ItemType = any;

@Component({
    templateUrl: './checkboxes.component.html',
    selector: 'wu-checkboxes'
})
export class CheckboxesComponent
{
    private _options: ItemType[];
    private _checkedOptions: ItemType[];

    private _equalsCallback: (a: any, b: any) => boolean = (a, b) => a === b;
    private _labelCallback: (a: any) => string = (a) => a;
    private _valueCallback: (a: any) => any = (a) => a;

    // For faster lookup of what option was clicked
    private valueToOptionMap: Map<string, ItemType> = new Map<string, ItemType>();

    private component: CheckboxesComponent;
    private rootElement;

    /**
     * The name of this checkboxes group.
     */
    @Input()
    groupName: string = "checkboxes";

    /**
     * Callbacks
     */
    @Input()
    public set valueCallback(callback: (item: any) => any) {
        if (callback && isFunction(callback)) {
            this._valueCallback = callback;
        }
    }

    public get valueCallback() {
        return this._valueCallback;
    }

    @Input()
    public set equalsCallback(callback: (a: any, b: any) => boolean) {
        if (callback && isFunction(callback)) {
            this._equalsCallback = callback;
        }
    }

    public get equalsCallback() {
        return this._equalsCallback;
    }

    @Input()
    public set labelCallback(callback: (a: any) => string) {
        if (callback && isFunction(callback)) {
            this._labelCallback = callback;
        }
    }

    public get labelCallback() {
        return this._labelCallback;
    }

    /**
     * All available options.
     */
    @Input()
    set options(options: ItemType[]) {
        if (options && !Array.isArray(options)) {
            throw new Error("Invalid value for options. Expecting array, got: " + JSON.stringify(options));
        }

        this._options = options || [];

        this._options.forEach(option => this.valueToOptionMap.set(this.valueCallback(option), option));
    }

    get options(): ItemType[] {
        return this._options;
    }

    /**
     * This can be either the values or a subset of options.
     */
    @Input()
    public set checkedOptions(checkedOptions: ItemType[]) {
        if (checkedOptions && !Array.isArray(checkedOptions)) {
            throw new Error("Invalid value for checkedOptions. Expecting array, got: " + JSON.stringify(checkedOptions));
        }

        this._checkedOptions = checkedOptions || [];
    }

    public get checkedOptions() {
        return this._checkedOptions;
    }

    @Output()
    checkedOptionsChange = new EventEmitter<string[] | ItemType[]>();

    public constructor(element: ElementRef, private _zone: NgZone) {
        this.component = this;
        this.rootElement = element.nativeElement;
    }

    shouldBeChecked(option: ItemType): boolean {
        console.log("shouldBeChecked() called.", option, this.checkedOptions);
        let res = (() => {
            if (!this.checkedOptions)
                return false;

            //if ((<ItemType[]>this.checkedOptions).indexOf(option) != -1)
            if ((<ItemType[]>this.checkedOptions).some(checkedOption => this.equalsCallback(option, checkedOption)))
                return true;

            if ((<string[]>this.checkedOptions).indexOf(this.valueCallback(option)) != -1)
                return true;

            return false;
        })();
        console.log("shouldBeChecked() says " + res);
        return res;
    }

    handleCheckboxChange(option: ItemType, $event)  {
        console.log("handleCheckboxChange() called", option, $event);
        this.updateCheckedValues();
    }

    private updateCheckedValues(): void {
        this.checkedOptions = this.getCheckedValues();
        this.checkedOptionsChange.emit(this.checkedOptions);
        console.log("updateCheckedValues() done", this.checkedOptions);
    }

    private getCheckedValues(): string[] | ItemType[] {
        let component = this;
        let values = $(this.rootElement).find(":checkbox:checked").map(
            function (i, domElement): string {
                if (!domElement['checked'])
                    return null;
                let val = domElement["value"];

                let clickedOption = component.valueToOptionMap.get(val);
                if (!clickedOption)
                    return console.warn("Unknown option clicked", val), null;
                else
                    return clickedOption;
            }
        ).get();  // http://api.jquery.com/map/
        return <string[] | ItemType[]> values;
    }

}

export interface CheckboxData {
    value: string,
    label: string,
    data: any,
    checked: boolean
}
