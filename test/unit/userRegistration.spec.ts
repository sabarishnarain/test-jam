import { expect } from 'chai';
import userhelper from '../../src/helpers/userHelper';
import securityKeyHelper from '../../src/helpers/securityKeyHelper';
import userHelper from '../../src/helpers/userHelper';

describe('UserHelper Tests', () => {

  before( () => {
    userHelper.removeUser('sudouser');
  });

  it ('Password with tailing space', async () => {
    expect(await userhelper.verifyPassword('jdam','jdam ')).to.equal(false);
  });

  it ('Password with leading space', async () => {
    expect(await userhelper.verifyPassword('jdam',' jdam')).to.equal(false);
  });

  it ('Register with invalid secret', async () => {
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

  it ('Register with valid secret ', async () => {
    const initialUsersCount = userhelper.getAllUsers().length;

    const key = securityKeyHelper.createSecret();
    await userHelper.createUser('sudouser', 'sudouser', key);
    expect(userhelper.getAllUsers().length).to.equal(initialUsersCount + 1);
    const user = userHelper.findUser('sudouser');
    expect(user).to.not.equal(undefined);
    expect(userHelper.findUserById(user.id)).to.not.equal(undefined);

  });

  afterEach( () => {
    userHelper.removeUser('sudouser');
  });

 });
