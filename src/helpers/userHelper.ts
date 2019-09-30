import path from 'path';
import dbHelper, { MODEL } from './dbHelper';
import util from '../utils/util';

const fsUsersJSON = dbHelper.getDataFile(MODEL.USER);
import fs from 'fs';
import securityKeyHelper from './securityKeyHelper';

export default class userHelper {

  /**
   * Find user by id.
   * @param username
   * @returns user object | undefined
   */
  public static findUserById(id: number) {
    return this.getAllUsers().filter( (user: any) => {
        return user.id === id;
    })[0];
  }

  /**
   * Find user by username
   * @param username
   * @returns user object | undefined
   */
  public static findUser(username: string) {
    return this.getAllUsers().filter( (user: any) => {
        return user.username === username;
    })[0];
  }

  public static createUser(username: string, password: string, secret: string) {

    if (!securityKeyHelper.isValidSecret(secret)) {
      throw Error('Invalid security key.');
    }
    const usersJson = this.getAllUsers();
    const recentId = util.getMaxId(this.getAllUsers());
    const adminFlag = (recentId === 0) ? 1 : 0; // first user is always admin
    usersJson.push({id : recentId + 1, username, password, admin : adminFlag});
    this.saveContents(usersJson);
    securityKeyHelper.removeSecret(secret);

  }

  public static getAllUsers(): any {
    return JSON.parse(fs.readFileSync(fsUsersJSON, 'utf-8'));
  }

  public static verifyPassword(username: string, password: string): boolean {
    const user = this.findUser(username);
    if (user && user.password === password) {
      return true;
    }
    return false;
  }

  public static saveContents(contents: any) {
    fs.writeFileSync(fsUsersJSON, JSON.stringify(contents));
  }

}
