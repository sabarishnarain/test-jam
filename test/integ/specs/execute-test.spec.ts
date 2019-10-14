import Session from '../page-objects/Session';
import {assert} from 'chai';
import Links from '../page-objects/common/Links';
import Sprint from '../page-objects/sprints/Sprint';

describe('Test usecases', () => {
  it('Edit delete test ', () => {
    Session.init().loginAs();

    const DEFAULT_PROJECT = 'sudoproject';
    const DEFAULT_SPRINT = 'sudosprint';
    const SECOND_SPRINT = 'second sprint';

      // Add test to project
    const test = Links.addTest();
    const TITLE1 = 'title1' + Date.now();
    test.enterDetails(TITLE1, 'description', DEFAULT_PROJECT).create();

    // open sprint and add test to it
    let sprints = Links.sprints();
    sprints.createSprint(SECOND_SPRINT);
    let sprint: Sprint = sprints.openSprint(DEFAULT_SPRINT);
    sprint.addTestsToSprint([TITLE1]);
    sprints = Links.sprints();
    sprint = sprints.openSprint(SECOND_SPRINT);
    sprint.addTestsToSprint([TITLE1]);

    // come back to home, select sudosprint and select sudoproject.
    let home =  Links.home();
    // the test must be available as no run status.
    home.selectSprint(DEFAULT_SPRINT);
    home.selectProject(DEFAULT_PROJECT);
    assert.equal(home.getTestWithTitle(TITLE1).status, 'NO RUN');

    // select second sprint and verify if test with TUTLE2 exists
    home.selectSprint(SECOND_SPRINT);
    home.selectProject(DEFAULT_PROJECT);
    assert.equal(home.getTestWithTitle(TITLE1).status, 'NO RUN');

    // open test1 -> execute it for DEFAULT SPRINT as PASS
    const id = home.getTestWithTitle(TITLE1).id;
    const editTest = home.openTest(id);
    editTest.execute().enterDetails('b100', DEFAULT_SPRINT , 'PASS').save();
    // Execute once again for SECOND SPRINT AS FAIL
    editTest.execute().enterDetails('b200', SECOND_SPRINT, 'FAIL').save();

    // go to home and check status
    home = Links.home();
    home.selectSprint(DEFAULT_SPRINT);
    home.selectProject(DEFAULT_PROJECT);
    assert.equal(home.getTestWithTitle(TITLE1).status, 'PASS');
    assert.equal(home.getTestWithTitle(TITLE1).build, 'b100');

    home.selectSprint(SECOND_SPRINT);
    home.selectProject(DEFAULT_PROJECT);
    assert.equal(home.getTestWithTitle(TITLE1).status, 'FAIL');
    assert.equal(home.getTestWithTitle(TITLE1).build, 'b200');

  });
 });
