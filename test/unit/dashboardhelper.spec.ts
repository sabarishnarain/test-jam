import { expect } from 'chai';
import chai from 'chai';
import dashboardhelper from '../../src/helpers/dashboardHelper';
import projectHelper from '../../src/helpers/projectHelper';
import {initializeDB} from '../../src/server/env';
import testHelper from '../../src/helpers/testHelper';
import sprintHelper from '../../src/helpers/sprintHelper';
import viewHelper from '../../src/helpers/viewHelper';

// tslint:disable-next-line: no-var-requires
chai.use(require('chai-string'));

describe('Dashboard Helper Tests', () => {

  const testIdsArr: number[] = [];

  before( () => {
    initializeDB();
  });

  function removeProjectsAndSPrints() {
    testHelper.removeTests(testIdsArr);
    const project = projectHelper.getProjectByName('sampleproject');
    if (project) {
      projectHelper.removeProject(project.id);
    }

    const sprint = sprintHelper.getSprintByName('R1');
    if (sprint) {
      sprintHelper.removeSprint(sprint.id);
    }

  }

  beforeEach( () => {
    removeProjectsAndSPrints();
  });

  afterEach( () => {
   removeProjectsAndSPrints();

    });

  it('Should tests and statistics ', () => {
    const PROJECT_NAME = 'dbtestproject';
    expect(dashboardhelper.getData().results.length).to.equal(0);

    const res = projectHelper.createProject(PROJECT_NAME);
    expect(res.err).to.be.undefined;
    const project = projectHelper.getProjectByName(PROJECT_NAME);

    // Add couple tests to project
    let jres = testHelper.addTest('project1Test1', 'project1Test1', '', project.id);
    testIdsArr.push(jres.success.testId);
    jres = testHelper.addTest('project1Test2', 'project1Test2', '', project.id);
    testIdsArr.push(jres.success.testId);

    // Add sprint
    sprintHelper.addSprint('R1');

    const sprintId = sprintHelper.getSprintByName('R1').id;

    // Add the above created tests into this sprint.
    sprintHelper.addTestsToSprint(testIdsArr, sprintId);

    // verify if data is not 0
    // tslint:disable-next-line: no-unused-expression
    expect(dashboardhelper.getData().results.length).to.equal(1);
    const homeViewData = viewHelper.getDataForHomeView(sprintId, project.id);
    expect(homeViewData.sprints.length).to.equal(2); // default sprint is sudosprint
    expect(homeViewData.results.length).to.equal(2);

  });

 });
