import { expect } from 'chai';
import chai from 'chai';
import projectHelper from '../../src/helpers/projectHelper';
import {initializeContents} from '../../src/server/env';
import assert from 'mocha';

// tslint:disable-next-line: no-var-requires
chai.use(require('chai-string'));

describe('Project Helper Tests', () => {

  before( () => {
    initializeContents();
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
    const res = projectHelper.createProject('sudoproject');
    // tslint:disable-next-line: no-unused-expression
    expect(res.err).to.be.undefined;
    const initCount = projectHelper.getAllProjects().length;
    // tslint:disable-next-line: no-unused-expression
    expect(projectHelper.createProject('sudoproject').err.msg).to.equal('Project name already exists');
    expect(projectHelper.getAllProjects().length).to.equal(initCount);

  });

  it('Lengthy project name', () => {
    const res = projectHelper.createProject('this is the biggest project name more than anyone could write because it should more than 125 chars for the test to pass ortherwise it will fail');
    // tslint:disable-next-line: no-unused-expression
    expect(res.err.msg).to.equal('Project name is too lengthy.');
  });

  it('test getProject', () => {
    const res = projectHelper.createProject('sudoproject');
    const project = projectHelper.getProjectByName('sudoproject');
    expect(res.err).to.be.undefined;
    // tslint:disable-next-line: no-unused-expression
    expect(projectHelper.getProject(project.id)).to.not.be.undefined;

  });

  it ('test rename project', () => {
    let res = projectHelper.createProject('sudoproject');
    expect(res.err).to.be.undefined;

    res = projectHelper.updateName('invalid name', 'newnameproject');
    expect(res.success).to.be.undefined;
    expect(res.err.msg).to.equal('Project with name "invalid name" not found!');

    // empty name
    res = projectHelper.updateName(' ', 'newnameproject');
    expect(res.success).to.be.undefined;

    // valid name
    const project = projectHelper.getProjectByName('sudoproject');
    res = projectHelper.updateName(project.name, 'newnameproject');
    expect(res.err).to.be.undefined;

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


})
