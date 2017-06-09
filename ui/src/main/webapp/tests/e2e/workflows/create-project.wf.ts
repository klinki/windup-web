import {ProjectPage} from "../pages/project.po";
import {CreateProjectPage} from "../pages/wizard/create-project.po";

export class CreateProjectWorkflow {
    public createProject(name: string) {
        const projectPage = new ProjectPage();
        projectPage.navigateTo()
            .then(() => projectPage.newProject())
            .then(() => {
                const createProjectPage = new CreateProjectPage();
                createProjectPage.setTitle(name);
                createProjectPage.clickNext();
            });
    }
}
