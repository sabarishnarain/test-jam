import dbHelper, { MODEL } from './dbHelper';
import util from '../utils/util';
import bcrypt from 'bcrypt';

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

  public static async createUser(username: string, password: string, secret: string) {

    if (util.isSecretRequired() && !securityKeyHelper.isValidSecret(secret)) {
      throw new Error('Invalid security key');
    }
    const usersJson = this.getAllUsers();
    const recentId = util.getMaxId(this.getAllUsers());
    const firstAdminFlag = (recentId === 0) ? 1 : 0; // first user is always admin
    const hash = await bcrypt.hash(password, 10);
    usersJson.push({id : recentId + 1, username, password: hash, admin : firstAdminFlag});
    this.saveContents(usersJson);
    securityKeyHelper.removeSecret(secret);

  }

  public static getAllUsers(): any {
    return JSON.parse(fs.readFileSync(fsUsersJSON, 'utf-8'));
  }

  public static async verifyPassword(username: string, password: string): Promise<boolean> {
    const user = this.findUser(username);

    if (user && await bcrypt.compare(password, user.password)) {
      return true;
    }
    return false;
  }

  public static saveContents(contents: any) {
    fs.writeFileSync(fsUsersJSON, JSON.stringify(contents));
  }

}
