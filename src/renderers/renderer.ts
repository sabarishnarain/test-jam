import sprintHelper from '../helpers/sprintHelper';
import projectHelper from '../helpers/projectHelper';
import testHelper from '../helpers/testHelper';

export default class renderers {

  /**
   * Routes /projects.html
   * @param res
   * @param projectsWithTests - projects
   * @param error
   */
  public static projects(res: any, error?: string, success?: string) {
    const projectsWithTests = [];
    const projects = projectHelper.getAllProjects();
    for (const p of projects) {
      const tests = testHelper.getTestsForProject(p.id);
      const testCount = tests.length;
      projectsWithTests.push( { project: p, testCount} );
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
    res.render('project', { tests, project, error, success});
  }

  public static createProject(res: any, error?: string, success?: string) {
    res.render('createProject', { error, success});

  }

  public static addNewTest(res: any, projects: any, filter: any, error?: string, success?: string, title?: string,
                           desc?: string, identifier?: string) {
    res.render('addNewTest', { projects, filter, error, success, title, desc, identifier});
  }

  public static runTest(res: any, test: any, statuses: string[], sprints: any, error?: string, success?: string) {
    res.render('runTest', { test, statuses, sprints, error, success});
}

  public static home(res: any, sprints: any, sprintFilter: any, projects: any, projectFilter: any,
                     results: any, error?: string, success?: string) {
    res.render('home', { sprints, sprintFilter, projects ,
      projectFilter, results, error, success});
  }

  public static dashboard(res: any, sprintFilter: any, data: any) {
    res.render('dashboard', { sprints: sprintHelper.getAllSprints(), sprintFilter, data});

  }

  public static completion(res: any, sprintFilter: any, data: any) {
    res.render('completion', { sprints : sprintHelper.getAllSprints(), sprintFilter, data});

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

  public static sprints(res: any, sprints: any, error?: string, success?: string) {
    res.render('sprints', {sprints, error, success});
  }

  public static sprint(res: any, sprint: any, tests: any, allOtherTests: any, error?: string, success?: string) {
    res.render('sprint', {sprint, tests, allOtherTests, error, success});
  }

}
