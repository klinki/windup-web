import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import {CheckboxesComponent} from "../../../src/app/shared/checkboxes.component";
import {initDomAdapter} from "@angular/platform-browser/src/browser";

let comp:    CheckboxesComponent;
let fixture: ComponentFixture<CheckboxesComponent>;
let de:      DebugElement;
let el:      HTMLElement;

describe('CheckboxesComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [
                CheckboxesComponent
            ]
        });

        fixture = TestBed.createComponent(CheckboxesComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('div.checkboxes-component'));
        el = de.nativeElement;
    });
    /* <div *ngFor="let option of _options">
     <label>
     <input type="checkbox" [name]="groupName"
     [value]="valueCallback(option)"
     [checked]="shouldBeChecked(option)"
     (change)="handleCheckboxChange(option, $event)"
     />
     {{labelCallback(option)}}
     </label>
     </div>
*/


     describe('For simple values', () => {
        let items = ['hello', 'world', '42', 'whatever'];

        beforeEach(() => {
            comp.options = items;
        });

        it('should display checkbox with label for each item', () => {
            fixture.detectChanges();

            let labels = fixture.debugElement.queryAll(By.css('label'));

            expect(labels.length).toEqual(items.length);

            let textValues = labels.map(el => el.nativeElement.textContent.trim());

            items.forEach(item => {
                expect(textValues).toContain(item);
            })
        });

        it('should fire change event when item is selected', () => {
            let mock = jasmine.createSpyObj('Spy', ['checkedOptionsChange']);

            comp.checkedOptions = [];
            comp.checkedOptionsChange = mock.checkedOptionsChange;

            fixture.detectChanges();

            let labels = fixture.debugElement.queryAll(By.css('label'));
            let firstItem = labels.find(element => element.children[0].properties['name'] === items[0]);

//            firstItem.children[0].nativeElement.click();
            firstItem.children[0].triggerEventHandler('click', null);
//            cancelLink.triggerEventHandler('click', null);

            fixture.detectChanges();

            expect(mock.checkedOptionsChange).toHaveBeenCalled();
            expect(mock.checkedOptionsChange).toHaveBeenCalledWith([ items[0] ]);
        });

        it('should automatically select items based on checkedOptions', () => {
            let expectedCheckedItems = ['hello', 'world'];
            comp.checkedOptions = expectedCheckedItems;

            fixture.detectChanges();

            let labels = fixture.debugElement.queryAll(By.css('label'));

            let checkboxItems = new Map<string, boolean>();

            let checkboxValues = labels.map(element => {
                checkboxItems.set(element.children[0].properties['name'], element.children[0].properties['checked']);

                return {
                    text: element.children[0].properties['name'],
                    checked: element.children[0].properties['checked']
                };
            });

            let selectedValues = checkboxValues.filter(item => item.checked);

            expect(selectedValues.length).toBe(expectedCheckedItems.length);

            expectedCheckedItems.forEach(checkedItem => {
                expect(checkboxItems.get(checkedItem)).toBe(true);
            })
        });

        it('should automatically update selection when checkedOptions changes', () => {
            let initiallyCheckedItems = ['hello', 'world'];
            comp.checkedOptions = initiallyCheckedItems;
            fixture.detectChanges();

            let newCheckedItems = ['42'];
            comp.checkedOptions = newCheckedItems;
            fixture.detectChanges();

            let labels = fixture.debugElement.queryAll(By.css('label'));
            let selectionMap = getSelectionMap(labels);

            let expectedUncheckedItems = items.filter(item => newCheckedItems.indexOf(item) === -1);

            newCheckedItems.forEach(item => {
                expect(selectionMap.get(item)).toBe(true);
            });

            expectedUncheckedItems.forEach(item => {
                expect(selectionMap.get(item)).toBe(false);
            });
        });

        it('should automatically update items when options changes', () => {
            // first change detection for first value
            fixture.detectChanges();

            let newOptions = ['Orange', 'Apple'];

            comp.options = newOptions;
            // second change detection for updated value
            fixture.detectChanges();

            let labels = fixture.debugElement.queryAll(By.css('label'));
            expect(labels.length).toEqual(newOptions.length);

            let textValues = labels.map(el => el.nativeElement.textContent.trim());

            newOptions.forEach(item => {
                expect(textValues).toContain(item);
            })
        });
    });

    describe('For object values', () => {
        let items = [
            { id: 1, label: 'Hello' },
            { id: 2, label: 'World' },
            { id: 3, label: '42' }
        ];

        beforeEach(() => {
            comp.options = items;
            fixture.detectChanges();
        });

        it('should use labelCallback function to get label', () => {

        });

        it('should use valueCallback function to get value', () => {

        });

        describe('when no comparator provided', () => {
            it('should use default object equality comparator', () => {

            });

            it('should properly identify selected objects', () => {});
        });

        describe('when custom comparator provided', () => {
            beforeEach(() => {
                comp.equalsCallback = (option: any, checkedOption: any) => option.id === checkedOption;
                comp.checkedOptions = [ 1 ];
            });

            it('should use that comparator', () => {

            });

            it('should properly identify selected objects', () => {

            });
        });
    });
});

function getSelectionMap(labelElements: DebugElement[]): Map<string, boolean> {
    let checkboxItems = new Map<string, boolean>();

    labelElements.forEach(element => {
        checkboxItems.set(element.children[0].properties['name'], element.children[0].properties['checked']);
    });

    return checkboxItems;
}

function assertSelection(map: Map<any, boolean>, expectChecked: any[], expectNotChecked: any[]) {
    expectChecked.forEach(item => {
        expect(map.get(item)).toBe(true);
    });

    expectNotChecked.forEach(item => {
        expect(map.get(item)).toBe(false);
    });
}
