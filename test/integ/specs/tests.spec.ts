import Session from '../pageobjects/Session';
import {assert} from 'chai';
import AddTest from '../pageobjects/AddTest';
import Projects from '../pageobjects/Projects';
import Project from '../pageobjects/Project';

describe('Test usecases', ()=> {
    it('Add delete test ', () => {
        const login = Session.init();
        let projects = login.loginAs('sss', 'sss').goToProjects(()=> { return new Projects()});

        const PROJECT_NAME = 'deleteme' + Date.now();

        projects.enterProjectName(PROJECT_NAME).create();
        assert.isTrue(projects.isProjectExists(PROJECT_NAME));

       let test: AddTest = projects.goToAddTest( () => new AddTest());

        test = test.enterDetails('title', 'description', PROJECT_NAME).create();

        const project: Project = test.goToProjects( ()=> { return new Projects()}).openProject(PROJECT_NAME);

        assert.isTrue(project.isTestExistsByTitle('title'));

        project.selectAllTests().deleteTest();

        assert.isFalse(project.isTestExistsByTitle('title'));

        project.deleteProject();

    })

   
})