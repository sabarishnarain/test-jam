import Session from '../page-objects/Session';
import {assert} from 'chai';
import Project from '../page-objects/projects/Project';
import * as integTestHelper from './integTestHelper';

describe('Project usecases', () => {
  it('Create & rename Project', () => {
    Session.init().loginAs();

    const PROJECT_NAME = 'tempproject' + Date.now();
    const projects = integTestHelper.createProject(PROJECT_NAME);

    const project: Project = projects.openProject(PROJECT_NAME);
    const newname = 'helloworld' + Date.now();
    project.rename(newname);
    assert.equal(project.getName(), newname);
    project.deleteProject();

    });
 });
