import Session from '../page-objects/Session';
import {assert} from 'chai';
import AddTest from '../page-objects/tests/AddTest';
import Projects from '../page-objects/projects/Projects';
import Project from '../page-objects/projects/Project';
import EditTest from '../page-objects/tests/EditTest';
import Home from '../page-objects/Home';
import Links from '../page-objects/common/Links';

describe('Test usecases', () => {
  it('Edit delete test ', () => {
    Session.init().loginAs();
    const projects = Links.projects();

    const PROJECT_NAME = 'deleteme' + Date.now();

    // Create new project
    projects.enterProjectName(PROJECT_NAME).create();
    assert.isTrue(projects.isProjectExists(PROJECT_NAME));

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
