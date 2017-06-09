import {browser, by, element} from "protractor";

export class ProjectPage {
    newProjectButton = element(by.css('.btn.btn-primary'));

    public navigateTo() {
        return browser.get('/rhamt-web/');
    }

    public search(text: string) {
    }

    public sort() {}

    public sortOrder() {

    }

    public newProject() {
        return this.newProjectButton.click();
    }

    public editProject() {
    }

    public deleteProject() {
    }
}
