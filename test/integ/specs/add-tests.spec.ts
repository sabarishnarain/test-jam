import Session from '../page-objects/Session';
import {assert} from 'chai';
import Links from '../page-objects/common/Links';
import * as integTestHelper from './integTestHelper';

describe('Test usecases', () => {
  it('Add delete test ', () => {
    Session.init().loginAs();
    const PROJECT_NAME = 'deleteme' + Date.now();
    const TITLE = 'title' + Date.now();

    // create project
    const projects = integTestHelper.createProject(PROJECT_NAME);

    // Add test to this project
    Links.addTest().enterDetails(TITLE, 'description', PROJECT_NAME).create();

    // open project and verify if test exist
    const project = Links.projects().openProject(PROJECT_NAME);
    assert.isTrue(project.isTestExistsByTitle(TITLE));

    // select all tests and delete
    project.selectAllTests().deleteTest();

    // ensure test is removed
    assert.isFalse(project.isTestExistsByTitle(TITLE));

    // remove project
    project.deleteProject();

  });
 });
