import { expect } from 'chai';
import chai from 'chai';
import util from '../src/utils/util';

chai.use(require('chai-string'));


  describe("Project Helper Tests", () => {
  
    it("Should return greatest", () => {
      expect(util.getMaxId([{id: 1}, {id: 2}, {id: 3}])).to.equal(3);
    });

    it("Should return 0 ", () => {
      expect(util.getMaxId([])).to.equal(0);
    });

    it("Should return 0 ", () => {
        expect(util.getMaxId([{id: 1}])).to.equal(1);
      });

 })
