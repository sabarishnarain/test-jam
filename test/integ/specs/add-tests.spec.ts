import Session from '../page-objects/Session';
import {assert} from 'chai';
import Links from '../page-objects/common/Links';

describe('Test usecases', () => {
  it('Add delete test ', () => {
    const home = Session.init().loginAs();
    const projects = Links.projects();

    const PROJECT_NAME = 'deleteme' + Date.now();

    projects.enterProjectName(PROJECT_NAME).create();
    assert.isTrue(projects.isProjectExists(PROJECT_NAME));

    Links.addTest().enterDetails('title', 'description', PROJECT_NAME).create();

    const project = Links.projects().openProject(PROJECT_NAME);

    assert.isTrue(project.isTestExistsByTitle('title'));

    project.selectAllTests().deleteTest();

    assert.isFalse(project.isTestExistsByTitle('title'));

    project.deleteProject();

  });
 });
