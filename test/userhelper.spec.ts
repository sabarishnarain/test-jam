import { expect } from 'chai';
import userhelper from '../src/helpers/userHelper';

describe("UserHelper Tests", () => {

  it ('Default should be present', () => {
    expect(userhelper.findUser('jdam')).not.undefined;
  });

  it ('Find user by id' , () => {
    expect(userhelper.findUserById(1)).not.undefined;
  });

  it ('User jdam password is jdam', async () => {
      expect(await userhelper.verifyPassword('jdam','jdam')).to.equal(true);
    });

  it ('Password with tailing space', async () => {
    expect(await userhelper.verifyPassword('jdam','jdam ')).to.equal(false);
  });

  it ('Password with leading space', async () => {
    expect(await userhelper.verifyPassword('jdam',' jdam')).to.equal(false);
  });

  it ('Password with invalid secret', async () => {
    const initialUsersCount = userhelper.getAllUsers().length;
    try {
      await userhelper.createUser('test', ' test', 'invalid secret');
      expect.fail('No error thrown on registering user with invalid key');
    } catch (err) {
      console.log('Error is thrown');
      // user should not be created
      expect(userhelper.getAllUsers().length).to.equal(initialUsersCount);
    }
  });

 });
