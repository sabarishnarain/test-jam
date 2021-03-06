import { expect } from 'chai';
import chai from 'chai';
import projectHelper from '../../src/helpers/projectHelper';
import {initializeDB} from '../../src/server/env';
import {cleanUpProjects} from './unitTestHelper';

// tslint:disable-next-line: no-var-requires
chai.use(require('chai-string'));

describe('Project Helper Tests', () => {

  before( () => {
    initializeDB();
  });

  beforeEach( () => {
    cleanUpProjects();
  });

  it('Project with single word should be first 3 letters', () => {
    expect(projectHelper.generateProjectCode('foobar').startsWith('foo')).to.be.true;
  });

  it('Project id for two words should start with first two letters of two words', () => {
    expect(projectHelper.generateProjectCode('foo bar').startsWith('fob')).to.be.true;
  });

  it('Project id for three words should start with first two letters of each words', () => {
    expect(projectHelper.generateProjectCode('foo bar true').startsWith('fobatr')).to.be.true;
  });

  it('Create empty project', () => {
    const res = projectHelper.createProject('');
    // tslint:disable-next-line: no-unused-expression
    expect(res.err.msg).to.equal('Name cannot be empty');
  });

  it('Create duplicate project', () => {
    const res = projectHelper.createProject('sampleproject');
    // tslint:disable-next-line: no-unused-expression
    expect(res.err).to.be.undefined;
    const initCount = projectHelper.getAllProjects().length;
    // tslint:disable-next-line: no-unused-expression
    expect(projectHelper.createProject('sampleproject').err.msg).to.equal('Project name already exists');
    expect(projectHelper.getAllProjects().length).to.equal(initCount);

  });

  it('Lengthy project name', () => {
    const res = projectHelper.createProject('this is the biggest project name more than anyone could write because it should more than 125 chars for the test to pass ortherwise it will fail');
    // tslint:disable-next-line: no-unused-expression
    expect(res.err.msg).to.equal('Project name is too lengthy.');
  });

  it('test getProject', () => {
    const res = projectHelper.createProject('sampleproject');
    const project = projectHelper.getProjectByName('sampleproject');
    expect(res.err).to.be.undefined;
    // tslint:disable-next-line: no-unused-expression
    expect(projectHelper.getProject(project.id)).to.not.be.undefined;

  });

  function createsampleproject() {
    const res = projectHelper.createProject('sampleproject');
    expect(res.err).to.be.undefined;
  }

  it ('test rename project with invalid current name', () => {
    createsampleproject();
    const res = projectHelper.updateName('invalid name', 'newnameproject');
    expect(res.success).to.be.undefined;
    expect(res.err.msg).to.equal('Project with name "invalid name" not found!');

  });

  it ('test rename project with empty current name', () => {
    createsampleproject();
    const res = projectHelper.updateName(' ', 'newnameproject');
    expect(res.success).to.be.undefined;
    expect(res.err.msg).to.not.be.undefined;

  });


  it ('test rename project with empty new name', () => {
    createsampleproject();
    const res = projectHelper.updateName('sampleproject', ' ');
    expect(res.success).to.be.undefined;
    expect(res.err.msg).to.not.be.undefined;
  });


  it ('test rename project with duplicate name', () => {
    createsampleproject();
    const res = projectHelper.updateName('sampleproject', 'sampleproject');
    expect(res.success).to.be.undefined;
    expect(res.err.msg).to.not.be.undefined;

  });

  it ('test rename project with correct name', () => {
    createsampleproject();
    const res = projectHelper.updateName('sampleproject', 'newnameproject');
    expect(res.err).to.be.undefined;

  });

  afterEach( () => {
    cleanUpProjects();
  });

});
