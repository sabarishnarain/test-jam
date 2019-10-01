import { expect } from 'chai';
import testHelper from '../src/helpers/testHelper';

describe('Test Helper Tests', () => {

  const testIdsToRemove: string[] = [];

  it('Get project with id', () => {
    expect(testHelper.getTestById('5')).to.not.undefined;
  });

  it("Get Tests for sample project", () => {
    expect(testHelper.getTestsForProject('cdf7141').length).to.equal(1);
  });

  it("Add and update test", () => {
    const initCount = testHelper.getAllTests().length;
    const id1 = testHelper.addTest('test title', 'test desc', 'testMethod1', 'project1');
    testIdsToRemove.push(id1.toString());

    expect(testHelper.getAllTests().length).to.equal(initCount + 1);

    expect(testHelper.getTestById(id1.toString())).to.not.undefined;
    expect(testHelper.getTestById(id1.toString()).title).to.equal('test title');
    expect(testHelper.getTestById(id1.toString()).status).to.equal('');

    testHelper.updateTestById(id1.toString(), 'passed');
    expect(testHelper.getTestById(id1.toString()).status).to.equal('PASS');

    // since we passed the above test
    const expectStatusesForTest = ['NORUN#NORUN#false','PASS#PASS#true', 'FAIL#FAIL#false'];
    expect(testHelper.getStatusesForTest(id1.toString())).to.deep.equal(expectStatusesForTest);

    // history for this test should be empty array since we haven't ran this test yet
    expect(testHelper.getHistoryForTest(id1)).to.deep.equal([]);

    // run test by an invalid id and result should be false.
    let res = testHelper.runTestById('abcde', 'fail', '100');
    expect(res.err.msg).to.not.undefined;


    // run test with correct id
    res = testHelper.runTestById(id1.toString(), 'fail', '100');
    expect(res.successMsg).to.equal('Test successfully executed');
    expect(res.err).to.be.undefined;
    expect(testHelper.getTestById(id1.toString()).status).to.equal('FAIL');

    // run test with identifier
    expect(testHelper.runTestByIndentifier('testMethod1', 'project1', '100', 'PASS')).to.equal(true);
    expect(testHelper.getTestById(id1.toString()).status).to.equal('PASS');


  });

  it ("Get statuses", () => {
    const expectStatuses = ['-#--Select--', 'pass#PASS', 'fail#FAIL'];
    expect(testHelper.getStatuses()).to.deep.equal(expectStatuses);
  })

  after( () => { 
    testHelper.removeTests(testIdsToRemove)
  })

  
 })
