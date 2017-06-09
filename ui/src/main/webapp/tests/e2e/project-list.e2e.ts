import {ProjectPage} from "./pages/project.po";
import {CreateProjectWorkflow} from "./workflows/create-project.wf";

describe('Project List', () => {
    const projectPage = new ProjectPage();

    beforeEach(() => {
        projectPage.navigateTo();
    });

    describe('Empty project list', () => {
        beforeEach(() => {
            // TODO: Ensure no project exists
        });

        it('Should show create project button', () => {

        });
    });

    describe('Create project', () => {
        beforeAll(() => {
            const workflow = new CreateProjectWorkflow();
            workflow.createProject('Test');
        });

        it('Should do nothing at all :) ', () => {
        });
    });
});
