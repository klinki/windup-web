import {browser, by, element} from "protractor";

export class AnalysisConfigurationPage {
    saveAndRun = element(by.css('.btn.btn-primary:nth-child(3)'));
    save = element(by.css('.btn-primary')); // :nth-child(2)

    public clickSave() {
        return this.save.click();
    }

    public clickSaveAndRun() {
        return this.saveAndRun.click();
    }
}
