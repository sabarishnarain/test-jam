import { expect } from 'chai';
import chai from 'chai';
import dashboardhelper from '../src/helpers/dashboardHelper';
import projectHelper from '../src/helpers/projectHelper';
import {initializeContents} from '../src/server/env';
import testHelper from '../src/helpers/testHelper';

// tslint:disable-next-line: no-var-requires
chai.use(require('chai-string'));

describe('Dashboard Helper Tests', () => {

  before( () => {
    initializeContents();
  });

  beforeEach( () => {
    const project = projectHelper.getProjectByName('sudoproject');
    if (project) {
      projectHelper.removeProject(project.id);

    }
  });

  afterEach( () => {
    const project = projectHelper.getProjectByName('sudoproject');
    if (project) {
      projectHelper.removeProject(project.id);

    }  });

  it('Should tests and statistics ', () => {
    // tslint:disable-next-line: no-unused-expression
    expect(dashboardhelper.getData().length).to.equal(0);

    const res = projectHelper.createProject('sudoproject');
    // tslint:disable-next-line: no-unused-expression
    expect(res.err).to.be.undefined;
    const project = projectHelper.getProjectByName('sudoproject');

    testHelper.addTest('sudotest', 'sudodesc', '', project.id);

    // tslint:disable-next-line: no-unused-expression
    expect(dashboardhelper.getData().length).to.equal(1);
  });

 });
