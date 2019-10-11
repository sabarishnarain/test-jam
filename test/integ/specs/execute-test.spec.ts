import Session from '../page-objects/Session';
import {assert} from 'chai';
import AddTest from '../page-objects/tests/AddTest';
import Projects from '../page-objects/projects/Projects';
import Project from '../page-objects/projects/Project';
import EditTest from '../page-objects/tests/EditTest';
import Home from '../page-objects/Home';
import Links from '../page-objects/common/Links';
import Sprint from '../page-objects/sprints/Sprint';

describe('Test usecases', () => {
  it('Edit delete test ', () => {
    Session.init().loginAs();
  
    const DEFAULT_PROJECT = 'sudoproject';

      // Add test to project
    let test = Links.addTest();
    const TITLE = 'title' + Date.now();
    test.enterDetails(TITLE, 'description', DEFAULT_PROJECT).create();
    
    // open sprint and add test to it
    let sprints = Links.sprints();
    const sprint: Sprint = sprints.openSprint('sudosprint');
    sprint.addTestsToSprint([TITLE]);

    // come back to home, select sudosprint and select sudoproject.
    let home =  Links.home();
    // the test must be available as no run status.
    home.selectSprint('sudosprint');
    home.selectProject('sudoproject');
    assert.equal(home.getTestWithTitle(TITLE).status, 'NO RUN');
    // open test -> execute it for sudosprint as PASS
    const id = home.getTestWithTitle(TITLE).id;
    home.openTest(id).execute().enterDetails('100', 'sudosprint', 'FAIL').save();
    // back to 
    home = Links.home();
    home.selectSprint('sudosprint');
    home.selectProject('sudoproject');

    assert.equal(home.getTestWithTitle(TITLE).status, 'FAIL');
    assert.equal(home.getTestWithTitle(TITLE).build, '100');

    // redo the same with PASS status
    home.openTest(id).execute().enterDetails('200', 'sudosprint', 'PASS').save();
    home = Links.home();
    home.selectSprint('sudosprint');
    home.selectProject('sudoproject');

    assert.equal(home.getTestWithTitle(TITLE).status, 'PASS');
    assert.equal(home.getTestWithTitle(TITLE).build, '200');

  });
 });
