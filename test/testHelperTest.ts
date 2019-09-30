import { expect } from 'chai';
import chai from 'chai';
import testHelper from '../src/helpers/testHelper';

  describe("Test Helper Tests", () => {
  
    it("Get project with id", () => {
      expect(testHelper.getTestById('5')).to.not.undefined;
    });


    it("Get Tests for sample project", () => {
      expect(testHelper.getTestsForProject('cdf7141').length).to.equal(1);
    });

  
 })
