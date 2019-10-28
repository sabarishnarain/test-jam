import { expect } from 'chai';
import chai from 'chai';
import sprintHelper from '../../src/helpers/sprintHelper';
import {initializeDB} from '../../src/server/env';
import testHelper from '../../src/helpers/testHelper';
import projectHelper from '../../src/helpers/projectHelper';
import testrunHelper from '../../src/helpers/testrunHelper';

// tslint:disable-next-line: no-var-requires
chai.use(require('chai-string'));

describe('Sprint Helper Tests', () => {

  const testIdsToDispose: string[] = [];

  before( () => {
    initializeDB();
  });

  it('Get sprint by invalid name should be null', () => {
    expect(sprintHelper.getSprintByName('foobar')).to.be.undefined;
  });

  it('Add sprint by empty name', () => {
    const jres = sprintHelper.addSprint(' ');
    expect(jres.err).to.not.be.undefined;
  });

  it('Duplicate sprint', () => {
    let jres = sprintHelper.addSprint('testSprint');
    expect(jres.err).to.be.undefined;
    jres = sprintHelper.addSprint('testSprint');
    expect(jres.err).to.not.be.undefined;
  });

  it('Add and delete sprint', () => {
    const jres = sprintHelper.addSprint('testSprint');
    expect(jres.err).to.be.undefined;
    const sprint = sprintHelper.getSprintByName('testSprint');
    sprintHelper.removeSprint(sprint.id);
    expect(sprintHelper.getSprintById(sprint.id)).to.be.undefined;
  });

  it('Get multiple sprints by id', () => {
    let jres = sprintHelper.addSprint('testSprint');
    const sprint1 = sprintHelper.getSprintByName('testSprint');

    expect(jres.err).to.be.undefined;
    jres = sprintHelper.addSprint('unit-test-sprint');
    expect(jres.err).to.be.undefined;
    const sprint2 = sprintHelper.getSprintByName('unit-test-sprint');

    const sprints = sprintHelper.getSprintsById([sprint1.id, sprint2.id]);
    expect(sprints.length).to.equal(2);

    const testId = createProjectAndTest();

    sprintHelper.addTestsToSprint([testId], sprint1.id);

    expect(sprintHelper.getAllOtherTestsNotInSprint(sprint1.id).length).to.equal(1);
    expect(sprintHelper.getAllOtherTestsNotInSprint(sprint2.id).length).to.equal(2);

    sprintHelper.removeTestsFromSprint(sprint1.id, [testId]);
    expect(sprintHelper.getAllOtherTestsNotInSprint(sprint1.id).length).to.equal(2);
    expect(sprintHelper.getAllOtherTestsNotInSprint(sprint2.id).length).to.equal(2);

  });

  function createProjectAndTest() {
    const PROJECTNAME = 'project' + Date.now();
    let jres = projectHelper.createProject(PROJECTNAME);
    expect(jres.err).to.be.undefined;
    const project = projectHelper.getProjectByName(PROJECTNAME);
    jres = testHelper.addTest('test title', 'test desc', 'testMethod1', project.id);
    expect(jres.err).to.be.undefined;
    testIdsToDispose.push(jres.success.testId.toString());
    return jres.success.testId;
  }

  it('Add tests to sprint', () => {
    const jres: any = sprintHelper.addSprint('testSprint');
    const sprint = sprintHelper.getSprintByName('testSprint');
    expect(jres.err).to.be.undefined;

    const testId = createProjectAndTest();
    testIdsToDispose.push(testId.toString());

    sprintHelper.addTestsToSprint([testId], sprint.id);

    const sprintsForTests = sprintHelper.getSprintsForTest(testId);
    expect(sprintsForTests[0].id).to.equal(sprint.id);

  });

  it('Bug #57 - Delete sprint after removing test', () => {
    // Add sprint
    let jres: any = sprintHelper.addSprint('testSprint');
    const sprint = sprintHelper.getSprintByName('testSprint');
    expect(jres.err).to.be.undefined;

    // Add project and test
    const testId = createProjectAndTest();
    testIdsToDispose.push(testId.toString());

    // Add test to sprint
    sprintHelper.addTestsToSprint([testId], sprint.id);

    // remove test
    testHelper.removeTests([testId]);

    // remove sprint should be successful
    jres = sprintHelper.removeSprint(sprint.id);
    expect(jres.err).to.be.undefined;
    expect(jres.success).to.equal('Sprint removed successfully.');

  });

  beforeEach( () => {
    cleanupTests();
    cleanUpSprints();

  });

  afterEach( () => {
    cleanupTests();
    cleanUpSprints();

    });

  function cleanupTests() {
   testHelper.removeTests(testIdsToDispose);
  }

  function cleanUpSprints() {
    const disposables = ['testSprint', 'unit-test-sprint'];

    for (const p of disposables) {
      const sprint = sprintHelper.getSprintByName(p);
      if (sprint) {
        const jres = sprintHelper.removeSprint(sprint.id);
        if (jres.err) {
          expect(jres.err.msg).to.be.undefined;
        }
      }
    }
  }

});
