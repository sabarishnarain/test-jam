import { expect } from 'chai';
import chai from 'chai';
import dashboardhelper from '../src/helpers/dashboardHelper';

chai.use(require('chai-string'));


  describe("Project Helper Tests", () => {
  
    it("Should return some meaningful data", () => {
      expect(dashboardhelper.getData()).to.not.undefined;
    });


 })
