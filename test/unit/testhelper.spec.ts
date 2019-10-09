import { expect } from 'chai';
import testHelper from '../../src/helpers/testHelper';
import projectHelper from '../../src/helpers/projectHelper';

import {initializeContents} from '../../src/server/env';

describe('Test Helper Tests', () => {


  before( async () => {
    await initializeContents();
  });

  const testIdsToRemove: string[] = [];

  it('Add and update test', () => {
    expect(projectHelper.createProject('sudoproject').err).to.be.undefined;
    const project = projectHelper.getProjectByName('sudoproject');

    const initCount = testHelper.getAllTests().length;
    const jres = testHelper.addTest('test title', 'test desc', 'testMethod1', project.id);
    expect(jres.err).to.be.undefined;
    const id1 = jres.success.testId;
    testIdsToRemove.push(id1.toString());

    expect(testHelper.getAllTests().length).to.equal(initCount + 1);

    expect(testHelper.getTestById(id1.toString())).to.not.undefined;
    expect(testHelper.getTestById(id1.toString()).title).to.equal('test title');

    testHelper.updateTestContents(id1, 'test title', 'test desc');


    // history for this test should be empty array since we haven't ran this test yet
    expect(testHelper.getHistoryForTest(id1)).to.deep.equal([]);

    // run test by an invalid id and result should be false.
    let res = testHelper.runTestById('abcde', 'fail', '100', '');
    expect(res.err.msg).to.not.undefined;


    // run test with correct id
    res = testHelper.runTestById(id1.toString(), 'fail', '100', 'sprint1');
    expect(res.success).to.equal('Test successfully executed');
    expect(res.err).to.be.undefined;
    // run test with identifier
    expect(testHelper.runTestByIndentifier('testMethod1', project.id, '100', 'PASS', undefined)).to.equal(true);


  });

  it ("Get statuses", () => {
    const expectStatuses = ['-#--Select--', 'pass#PASS', 'fail#FAIL'];
    expect(testHelper.getStatuses()).to.deep.equal(expectStatuses);
  })

  after( () => { 
    testHelper.removeTests(testIdsToRemove);
    projectHelper.removeProject('sudoproject');
  })

  
 })
