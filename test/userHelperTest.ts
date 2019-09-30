import { expect } from 'chai';
import userhelper from '../src/helpers/userHelper';

  describe("UserHelper Tests", () => {
   
    it("User sss should be present", () => {
      expect(userhelper.findUser('sss')).not.undefined;
    });


    it("User sss password is sss", () => {
      expect(userhelper.verifyPassword('sss','sss')).to.equal(true);
    });

    it("User sss password is sss with tailing space", () => {
      expect(userhelper.verifyPassword('sss','sss ')).to.equal(false);
    });

    it("User sss password is sss with leading space", () => {
        expect(userhelper.verifyPassword('sss',' sss')).to.equal(false);
    });
       
 })
