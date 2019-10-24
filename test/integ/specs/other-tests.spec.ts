import Session from '../page-objects/Session';
import {assert} from 'chai';
import Links from '../page-objects/common/Links';
import Sprint from '../page-objects/sprints/Sprint';
import {createProject} from './integTestHelper';
import Project from '../page-objects/projects/Project';
import EditTest from '../page-objects/tests/EditTest';

describe('Test usecases', () => {
  it('Create multiple test and verify other tests section ', () => {
    Session.init().loginAs();
    const PROJECT_NAME = 'sudoproject' + Date.now();

    createProject(PROJECT_NAME);

    // Add test to project
    let test = Links.addTest();
    test = test.enterDetails('title1', 'description', PROJECT_NAME).create();
    test = test.enterDetails('title2', 'description', PROJECT_NAME).create();
    test = test.enterDetails('title3', 'description', PROJECT_NAME).create();

    // Go to projects and open project and the test
    const project: Project = Links.projects().openProject(PROJECT_NAME);
    const editTest: EditTest = project.openTestByTitle('title1');

    // total number of other tests should 3
    assert.equal(3, editTest.getOtherTestList().count());

    // open the 3rd test
    const testId = editTest.getOtherTestList().getOtherTests()[2].getId();
    editTest.openTest(testId);

    assert.isTrue(editTest.getTitle() === 'title2' || editTest.getTitle() === 'title3');
  });
 });
