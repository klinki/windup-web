import {ProjectPage} from "./pages/project.po";
import {CreateProjectWorkflow} from "./workflows/create-project.wf";

describe('Project List', () => {
    const projectPage = new ProjectPage();

    describe('Empty project list', () => {
        beforeAll(() => {
            projectPage.navigateTo();
            // TODO: Ensure no project exists
        });

        it('Should not show project list', () => {
            expect(projectPage.projectListDiv.isPresent()).toBeFalsy();
        });

        it('Should show New project button', () => {
            expect(projectPage.newProjectButton.isPresent()).toBeTruthy();
        });

        it('Should show welcome message', () => {
            expect(projectPage.emptyStateDiv.isPresent()).toBeTruthy();
        });
    });

    describe('Create project', () => {
        let projectName: string;

        beforeAll(() => {
            const workflow = new CreateProjectWorkflow();
            //workflow.createProject('Test').then(() => projectPage.getProjectList())

            const date = new Date();

            projectName = 'Test ' + date.getTime().toString();

            workflow.createProject(projectName)
                .then(() => {
                    projectPage.getProjectList().then(data => {
                        console.log(data);
                    });
                });
        });

        it('Should show project list', () => {
            expect(projectPage.projectListDiv.isPresent()).toBeTruthy();
        });

        it('Should contain just created project', () => {
            projectPage.getProjectList().then(projects => {
                expect(projects.some(item => item.name === projectName)).toBeTruthy();
            });
        });
    });
});
