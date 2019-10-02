import path from 'path';
import testHelper from '../helpers/testHelper';

const clientBasePath = path.resolve(__dirname, '..', 'views');

export default class renderers {

  /**
   * Routes /projects.html
   * @param res
   * @param projectsWithTests - projects
   * @param error
   */
  public static projects(res: any, projects: any, error?: string, success?: string) {
    const projectsWithTests = [];
    for (const p of projects) {
      const tests = testHelper.getTestsForProject(p.id);
      projectsWithTests.push( { projectId: p.id, pName: p.name, testCount: tests.length});
    }
    res.render('projects', {projectsWithTests, error, success});
  }

  /**
   * Routes /project.html
   * @param res
   * @param tests - tests in particular project
   * @param project
   * @param error
   */
  public static project(res: any, tests: any, project: any, error?: string, success?: string) {
    res.render( 'project', { tests, project, error, success});
  }

  public static createProject(res: any, error?: string, success?: string) {
    res.render( 'createProject', { error, success});

  }

  public static addNewTest(res: any, projects: any, filter: any, error?: string, success?: string, title?: string,
                           desc?: string, identifier?: string) {
    res.render('addNewTest', { projects, filter, error, success, title, desc, identifier});
  }

  public static runTest(res: any, test: any, statuses: string[], error?: string, success?: string) {
    res.render('runTest', { test, statuses, error, success});
}

  public static home(res: any, projects: any, tests: any, filter: any, error?: string, success?: string) {
    res.render('home', { projects , tests, filter, error, success});
  }

  public static dashboard(res: any, results: any) {
    res.render('dashboard', { results});

  }

  public static completion(res: any, results: any) {
    res.render('completion', { results});

  }

  public static editTest(res: any, currentTest: any, projectsList: any, history: any,
                         otherTestsInProject: any, error?: string, success?: string) {
    res.render('editTest', {currentTest, projectsList, history, otherTestsInProject, error, success});
  }

  public static testHistory(res: any, projectName: any, history: any, error?: string, success?: string) {
    res.render( 'testHistory', {projectName, history, error, success });
  }

  public static register(res: any, securityKeyRequired: boolean, error?: string, success?: string) {
    res.render( 'register', {securityKeyRequired, error, success});
  }

  public static login(res: any, error?: string, success?: string) {
    res.render('login', {error, success});
  }

  public static users(res: any, username: string, users: any, error?: string, success?: string) {
    res.render('users', {username, users, error, success});
  }

  public static user(res: any, username: string, user: any, error?: string, success?: string) {
    res.render( 'user', {username, user, error, success});
  }

  public static error(res: any, username: string, error?: string ) {
    res.render( 'error', {username, error});
  }

  public static aboutUs(res: any) {
    res.render('about');
  }

}
