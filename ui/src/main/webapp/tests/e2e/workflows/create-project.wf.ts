import {ProjectPage} from "../pages/project.po";
import {CreateProjectPage} from "../pages/wizard/create-project.po";
import {AddApplicationsPage} from "../pages/wizard/add-applications.po";
import {AnalysisConfigurationPage} from "../pages/wizard/analysis-configuration.po";
import {browser, by, element} from "protractor";



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
//                promise.then();
                const analysisConfig = new AnalysisConfigurationPage();
                browser.sleep(1);
                return analysisConfig.clickSave().then(() => {
                    console.log('FIND CONFIRM BUTTON');

                    const confirmButton = element(by.css('.confirm-button'));

                    console.log('just logging');

                    return confirmButton.isPresent()
                        .then(isPresent => {
                            console.log('Is present?');
                            console.log(isPresent);
                            if (isPresent) {
                                return confirmButton.click();
                            }
                        }, error => {
                            console.log('is not present');
                            console.log(error);
                        });
                });
            });
    }
}
