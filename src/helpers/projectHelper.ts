
import dbHelper, { MODEL } from './dbHelper';
import jResult from '../server/jResult';

export default class testHelper {

  public static getAllProjects() {
    return dbHelper.getContents(MODEL.PROJECT);
  }

  public static getProject(pid: string) {
    return this.getAllProjects().filter( (p: any) => p.id === pid )[0];
  }

  public static getProjectByName(name: string) {
    return this.getAllProjects().filter( (p: any) => p.name === name )[0];
  }

  public static isProjectExists(name: string) {
    return this.getAllProjects().filter( (p: any) => {
      return name === p.name;
    }).length > 0;
  }

  public static createProject(name: string): jResult {

    let res;
    if (name.trim().length === 0) {
      res = new jResult({msg: 'Name cannot be empty'});
    } else if (name.length > 100) {
      res = new jResult( {msg: 'Project name is too lengthy.'});
    } else if (this.isProjectExists(name)) {
      res = new jResult({msg: 'Project name already exists'});
    } else {

      const projects = this.getAllProjects();
      const projectCode = this.generateProjectCode(name);
      projects.push({id: projectCode , name});
      this.saveProjects(projects);
      res = new jResult(undefined, `Project with name ${name} successfully created.`);

    }
    return res;

  }

  public static removeProject(projectId: string) {
    const projectsLst = this.getAllProjects();

    const projectsPostDelete = projectsLst.filter( (p: any) => {
      return p.id !== projectId;
    });

    this.saveProjects(projectsPostDelete);
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

  private static saveProjects(contents: any) {
    dbHelper.saveContents(MODEL.PROJECT, contents);
  }

}
