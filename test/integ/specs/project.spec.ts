import Session from '../pageobjects/Session';
import {assert} from 'chai';
import Projects from '../pageobjects/Projects';
import Project from '../pageobjects/Project';

describe('Project usecases', ()=> {
    it('Create & Delete Project', () => {
        const login = Session.init();
        let projects: Projects = login.loginAs('sss', 'sss').goToProjects(()=> { return new Projects()});
        const PROJECT_NAME = 'tempproject';

        // clean up existing projects if present 
        if (projects.isProjectExists(PROJECT_NAME)) {
            projects = projects.openProject(PROJECT_NAME).deleteProject();
        }
        assert.isFalse(projects.isProjectExists(PROJECT_NAME));

        projects.enterProjectName(PROJECT_NAME).create();
        assert.isTrue(projects.isProjectExists(PROJECT_NAME));

        const project: Project = projects.openProject(PROJECT_NAME);
        project.deleteProject();
        assert.isFalse(projects.isProjectExists(PROJECT_NAME));


    })
})