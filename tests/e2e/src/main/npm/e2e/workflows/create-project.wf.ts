import {ProjectPage} from "../pages/project.po";
import {CreateProjectPage} from "../pages/wizard/create-project.po";
import {AddApplicationsPage} from "../pages/wizard/add-applications.po";
import {AnalysisConfigurationPage} from "../pages/wizard/analysis-configuration.po";
import {browser, by, element} from "protractor";


// TODO: Parametrize this - maybe use ENV variable?
const UPLOAD_FILE_PATH = '/home/dklingen/Downloads/mariadb-java-client-1.5.5.jar';

export class CreateProjectWorkflow {
    public createProject(name: string) {
        const projectPage = new ProjectPage();
        return projectPage.navigateTo()
            .then(() => projectPage.newProject())
            .then(() => {
                const createProjectPage = new CreateProjectPage();
                createProjectPage.setTitle(name);
                return createProjectPage.clickNext();
            })
            .then(() => {
                const addApplications = new AddApplicationsPage();
                return addApplications.registerFileByServerPath(UPLOAD_FILE_PATH);
            })
            .then(() => {
                const analysisConfig = new AnalysisConfigurationPage();
                return analysisConfig.clickSave();
            })
            .then(() => {
                console.log('FIND CONFIRM BUTTON');
                return browser.sleep(100);
            }).then(() => {
                /**
                 * Something is broken here (a lot).
                 *
                 * We need to test if modal dialog is displayed and if it is, click button.
                 * BUT, protractor always freezes on `isPresent()` call. (And it seems to freeze on `click()` too).
                 *
                 * So it is basically impossible to get over this right now :(
                 */

                console.log('after sleep');

                const confirmButton = element(by.css('.confirm-button'));

                const modal = element(by.css('.modal'));

                modal.isPresent().then(isPresent => {
                    console.log('Modal is present? ' + isPresent);
                });

                //console.log(confirmButton);

                return confirmButton.click();
/*
                console.log('just logging');

                return browser.isElementPresent(confirmButton)
//                return confirmButton.isPresent()
                    .then(isPresent => {
                        console.log('Is present?');
                        console.log(isPresent);
                        if (isPresent) {
                            return confirmButton.click();
                        }
                    }, error => {
                        console.log('error');
                        console.log(error);
                    });*/
            });
    }
}
