import Session from '../page-objects/Session';
import {assert} from 'chai';
import Project from '../page-objects/projects/Project';
import EditTest from '../page-objects/tests/EditTest';
import Links from '../page-objects/common/Links';
import * as integTestHelper from './integTestHelper';

describe('Test usecases', () => {
  it('Edit delete test ', () => {
    Session.init().loginAs();

    // Create project
    const PROJECT_NAME = 'deleteme' + Date.now();
    const projects = integTestHelper.createProject(PROJECT_NAME);

    // Add test to project
    let test = Links.addTest();
    test = test.enterDetails('title', 'description', PROJECT_NAME).create();

    // Go to projects and open project and the test
    const project: Project = Links.projects().openProject(PROJECT_NAME);
    let edittest: EditTest = project.openTestByTitle('title');

    // Verify title and description
    assert.equal(edittest.getTitle(), 'title');
    assert.equal(edittest.getDescription(), 'description');

    // update title and description with new info
    edittest = edittest.enterDetails('newtitle', 'newdescription').save();
    assert.equal(edittest.getTitle(), 'newtitle');
    assert.equal(edittest.getDescription(), 'newdescription');

    // delete test
    edittest.delete(true);
    const testCount = Links.projects().openProject(PROJECT_NAME).getTests();
    assert.equal(testCount.length, 0 );

    project.deleteProject();

  });
 });
