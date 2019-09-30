import { expect } from 'chai';
import chai from 'chai';
import projectHelper from '../src/helpers/projectHelper';

chai.use(require('chai-string'));


  describe("Project Helper Tests", () => {
  
    it("Get project with id", () => {
      expect(projectHelper.getProject('cdf7141').id).to.equal('cdf7141');
    });


    it("Project with single word should be first 3 letters", () => {
      expect(projectHelper.generateProjectCode('foobar')).to.startsWith('foo');
    });

    it("Project id for two words should start with first two letters of two words", () => {
        expect(projectHelper.generateProjectCode('foo bar')).to.startsWith('fob');
      });

      it("Project id for three words should start with first two letters of each words", () => {
        expect(projectHelper.generateProjectCode('foo bar true')).to.startsWith('fobatr');
      });
 })
