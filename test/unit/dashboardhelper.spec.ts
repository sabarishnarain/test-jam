import { expect } from 'chai';
import chai from 'chai';
import dashboardhelper from '../../src/helpers/dashboardHelper';
import projectHelper from '../../src/helpers/projectHelper';
import {initializeDB} from '../../src/server/env';
import testHelper from '../../src/helpers/testHelper';
import sprintHelper from '../../src/helpers/sprintHelper';

// tslint:disable-next-line: no-var-requires
chai.use(require('chai-string'));

describe('Dashboard Helper Tests', () => {

  const testIdsArr: number[] = [];

  before( () => {
    initializeDB();
  });

  beforeEach( () => {
    const project = projectHelper.getProjectByName('sudoproject');
    if (project) {
      projectHelper.removeProject(project.id);

    }

    const strTestIdsArr = testIdsArr.map( (t: any) => { 
      return t.toString();
    });
    testHelper.removeTests(strTestIdsArr);

  });

  afterEach( () => {
    const project = projectHelper.getProjectByName('sudoproject');
    if (project) {
      projectHelper.removeProject(project.id);

    }
    const strTestIdsArr = testIdsArr.map( (t: any) => { 
      return t.toString();
    });
    testHelper.removeTests(strTestIdsArr);
  
    });

  it('Should tests and statistics ', () => {
    // tslint:disable-next-line: no-unused-expression
    expect(dashboardhelper.getData().results.length).to.equal(0);

    const res = projectHelper.createProject('sudoproject');
    // tslint:disable-next-line: no-unused-expression
    expect(res.err).to.be.undefined;
    const project = projectHelper.getProjectByName('sudoproject');

    // Add couple tests to project
    let jres = testHelper.addTest('project1Test1', 'project1Test1','', project.id);
    testIdsArr.push(jres.success.testId);
    jres = testHelper.addTest('project1Test2', 'project1Test2','', project.id);
    
    testIdsArr.push(jres.success.testId);

    // Add sprint
    sprintHelper.addSprint('R1');

    const sprintId = sprintHelper.getSprintByName('R1').id;

    // Add the above created tests into this sprint.
    sprintHelper.addTestsToSprint(testIdsArr, sprintId);

    // verify if data is not 0
    // tslint:disable-next-line: no-unused-expression
    expect(dashboardhelper.getData().results.length).to.equal(1);
  });

 });
