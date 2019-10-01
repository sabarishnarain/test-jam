
import dbHelper, { MODEL } from './dbHelper';

export default class testHelper {

  public static getAllProjects() {
    return dbHelper.getContents(MODEL.PROJECT);
  }

  public static getProject(pid: string) {
    console.log('Get project with id ', pid);
    return this.getAllProjects().filter( (p: any) => p.id === pid )[0];
  }

  public static saveProjects(contents: any) {
    dbHelper.saveContents(MODEL.PROJECT, contents);
  }

  /**
   * Generate project id.
   * 1. if name is single word, then first 3 chars + random 4 digit number
   * 2. if name is two or more words, then first letter of each word + random 4 digit number
   */
  public static generateProjectCode(name: string) {
    let code = '';

    if (name.split(' ').length > 1) {
      const arr = name.split(' ');
      for (const a of arr) {
        code = code + a.substr(0, 2);
      }
    } else {
      code = name.substr(0, 3);
     }
    return code + Date.now() % 10000;
  }

}
