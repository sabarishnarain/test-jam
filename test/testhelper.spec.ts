import { expect } from 'chai';
import testHelper from '../src/helpers/testHelper';
import {initializeContents} from '../src/server/env';

describe('Test Helper Tests', () => {


  before( async () => {
    await initializeContents();
  });

  const testIdsToRemove: string[] = [];

  it('Add and update test', () => {
    const initCount = testHelper.getAllTests().length;
    const id1 = testHelper.addTest('test title', 'test desc', 'testMethod1', 'project1');
    testIdsToRemove.push(id1.toString());

    expect(testHelper.getAllTests().length).to.equal(initCount + 1);

    expect(testHelper.getTestById(id1.toString())).to.not.undefined;
    expect(testHelper.getTestById(id1.toString()).title).to.equal('test title');

    testHelper.updateTestById(id1, 'passed');


    // history for this test should be empty array since we haven't ran this test yet
    expect(testHelper.getHistoryForTest(id1)).to.deep.equal([]);

    // run test by an invalid id and result should be false.
    let res = testHelper.runTestById('abcde', 'fail', '100', '');
    expect(res.err.msg).to.not.undefined;


    // run test with correct id
    res = testHelper.runTestById(id1.toString(), 'fail', '100', 'sprint1');
    expect(res.successMsg).to.equal('Test successfully executed');
    expect(res.err).to.be.undefined;
    // run test with identifier
    expect(testHelper.runTestByIndentifier('testMethod1', 'project1', '100', 'PASS', undefined)).to.equal(true);


  });

  it ("Get statuses", () => {
    const expectStatuses = ['-#--Select--', 'pass#PASS', 'fail#FAIL'];
    expect(testHelper.getStatuses()).to.deep.equal(expectStatuses);
  })

  after( () => { 
    testHelper.removeTests(testIdsToRemove)
  })

  
 })
