import { expect } from 'chai';
import testHelper from '../../src/helpers/testHelper';
import projectHelper from '../../src/helpers/projectHelper';

import {initializeDB} from '../../src/server/env';

describe('Test Helper Tests', () => {

  const testIdsToRemove: string[] = [];

  before( () => {
    initializeDB();
  });

  it('valid status', () => {
    expect(testHelper.isValidStatus('pass')).to.be.true;
    expect(testHelper.isValidStatus('fail')).to.be.true;

  });

  it('Add and update test', () => {
    const PROJECTNAME = 'sampleproject' + Date.now();

    expect(projectHelper.createProject(PROJECTNAME).err).to.be.undefined;
    const project = projectHelper.getProjectByName(PROJECTNAME);

    const initCount = testHelper.getAllTests().length;
    let jres = testHelper.addTest('test title', 'test desc', 'testMethod1', project.id);
    expect(jres.err).to.be.undefined;
    const id1 = jres.success.testId;
    testIdsToRemove.push(id1.toString());

    expect(testHelper.getAllTests().length).to.equal(initCount + 1);

    expect(testHelper.getTestById(id1.toString())).to.not.undefined;
    expect(testHelper.getTestById(id1.toString()).title).to.equal('test title');

    const testsForProject = testHelper.getTestsForProject(project.id);
    expect(testsForProject.length).to.equal(1);

    jres = testHelper.updateTestContents(id1, ' ', '', '', project.id);
    expect(jres.err).to.not.be.undefined;

    jres = testHelper.updateTestContents(id1, 'test title', 'test desc', 'test identifier', undefined);
    expect(jres.err).to.not.be.undefined;

    jres = testHelper.updateTestContents(id1, 'sample title to test more than 200 characters just to ensure' +
    'that we have tested this limit for test title. Other than that is should not be used for any sort of testing' +
    'but still i have to cover 200 char limit somehow to ensure this test works. Please treat this as test data only' +
    'and thinking over it is waste of time.', ' ', '', project.id);
    expect(jres.err).to.not.be.undefined;

    testHelper.updateTestContents(id1, 'test title', 'test desc', '', project.id);

    // history for this test should be empty array since we haven't ran this test yet
    expect(testHelper.getHistoryForTest(id1)).to.deep.equal([]);

    // run test by an invalid id and result should be false.
    let res = testHelper.runTestById('abcde', 'fail', '100', '', 'sudouser');
    expect(res.err.msg).to.not.undefined;

    // run test with correct id
    res = testHelper.runTestById(id1.toString(), 'fail', '100', 'sprint1', 'sudouser');
    expect(res.success).to.equal('Test successfully executed');
    expect(res.err).to.be.undefined;

    expect(testHelper.getHistoryForTest(id1).length).to.equal(1);

    // run test once again with correct id
    res = testHelper.runTestById(id1.toString(), 'pass', '100', 'sprint1', 'sudouser');
    expect(res.success).to.equal('Test successfully executed');
    expect(res.err).to.be.undefined;
    expect(testHelper.getHistoryForTest(id1).length).to.equal(2);

    // run test with identifier
    expect(testHelper.runTestByIndentifier('testMethod1', project.id, '100', 'PASS', undefined, 'sudouser')).to.equal(true);

    // remove test & ensure history is removed
    testHelper.removeTests([id1]);
    expect(testHelper.getHistoryForTest(id1).length).to.equal(0);

  });

  it ('Get statuses', () => {
    const expectStatuses = ['-#--Select--', 'pass#PASS', 'fail#FAIL'];
    expect(testHelper.getStatuses()).to.deep.equal(expectStatuses);
  });

  after( () => {
    testHelper.removeTests(testIdsToRemove);
    projectHelper.removeProject('sampleproject');
  });

 });
