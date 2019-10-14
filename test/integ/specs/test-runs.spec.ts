import Session from '../page-objects/Session';
import {assert} from 'chai';
import Links from '../page-objects/common/Links';
import Sprint from '../page-objects/sprints/Sprint';

describe('Test usecases', () => {
  it('Run test and verify history ', () => {
    Session.init().loginAs();

    const DEFAULT_PROJECT = 'sudoproject';
    const DEFAULT_SPRINT = 'sudosprint';

    // Add test to project
    const test = Links.addTest();
    const TITLE1 = 'title1' + Date.now();
    test.enterDetails(TITLE1, 'description', DEFAULT_PROJECT).create();

    let sprints = Links.sprints();
    sprints.createSprint(DEFAULT_SPRINT);
    let sprint: Sprint = sprints.openSprint(DEFAULT_SPRINT);
    sprint.addTestsToSprint([TITLE1]);
    sprints = Links.sprints();
    sprint = sprints.openSprint(DEFAULT_SPRINT);
    sprint.addTestsToSprint([TITLE1]);

    // open test from home and execute 
    let home =  Links.home();
    // the test must be available as no run status.
    home.selectSprint(DEFAULT_SPRINT);
    home.selectProject(DEFAULT_PROJECT);
    assert.equal(home.getTestWithTitle(TITLE1).status, 'NO RUN');

    // open test1 -> execute it for DEFAULT SPRINT as PASS
    const id = home.getTestWithTitle(TITLE1).id;
    let editTest = home.openTest(id);
    // by default runs should be 0
    assert.equal(editTest.getHistoryList().getCount(), 0);

    editTest = editTest.execute().enterDetails('b100', DEFAULT_SPRINT , 'PASS').save();
    assert.equal(editTest.getHistoryList().getCount(), 1);
    assert.equal(editTest.getHistoryList().get(0).getBuild(), 'b100');


    // execute second time with FAIL and check if test history is 2
    editTest = editTest.execute().enterDetails('b500', DEFAULT_SPRINT , 'FAIL').save();
    assert.equal(editTest.getHistoryList().getCount(), 2);
    assert.equal(editTest.getHistoryList().get(0).getBuild(), 'b500');


  });
 });
