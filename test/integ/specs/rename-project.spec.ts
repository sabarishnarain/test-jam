import Session from '../page-objects/Session';
import {assert} from 'chai';
import Projects from '../page-objects/projects/Projects';
import Project from '../page-objects/projects/Project';
import Links from '../page-objects/common/Links';

describe('Project usecases', () => {
  it('Create & rename Project', () => {
    Session.init().loginAs();

    let projects: Projects = Links.projects();
    const PROJECT_NAME = 'tempproject' + Date.now();

    // clean up existing projects if present
    if (projects.isProjectExists(PROJECT_NAME)) {
        projects = projects.openProject(PROJECT_NAME).deleteProject();
    }
    assert.isFalse(projects.isProjectExists(PROJECT_NAME));

    projects.enterProjectName(PROJECT_NAME).create();
    assert.isTrue(projects.isProjectExists(PROJECT_NAME));

    const project: Project = projects.openProject(PROJECT_NAME);
    const newname = 'helloworld' + Date.now();
    project.rename(newname);
    assert.equal(project.getName(), newname);
    project.deleteProject();

    });
 });