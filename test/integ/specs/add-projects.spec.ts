import Session from '../page-objects/Session';
import {assert} from 'chai';
import * as integTestHelper from './integTestHelper';

describe('Project usecases', () => {
  it('Create & Delete Project', () => {
      Session.init().loginAs();
      const PROJECT_NAME = 'add-project-test' + Date.now();
      const projects = integTestHelper.createProject(PROJECT_NAME);
      projects.openProject(PROJECT_NAME).deleteProject();
      assert.isFalse(projects.isProjectExists(PROJECT_NAME));

     });

 });
