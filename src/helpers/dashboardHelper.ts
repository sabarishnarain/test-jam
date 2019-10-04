import projectHelper from './projectHelper';
import sprintHelper from './sprintHelper';
import { fail } from 'assert';

export default class dashboardHelper {

  public static getData(sprintId?: string) {
    const results = [];
    const calculatedSprintId = (sprintId) ? parseInt(sprintId, 10) : sprintHelper.getRecentSprintId();

    const projectIdsToTestMap: Map <string, any> = this.getProjectIdsToTestMap(calculatedSprintId);

    // calculate the number of no-run tests in each project.
    for (const [key, value] of projectIdsToTestMap) {

      const tests = value;
      let passCount = 0;
      let failCount = 0;

      for (const t of tests) {
        if (t.status === 'PASS') {
          passCount++;
        } else if (t.status === 'FAIL') {
          failCount++;
        }
      }
      const project = projectHelper.getProject(key.toString());

      results.push( { project, totalCount : passCount + failCount, passCount });
    }

    return  { sprintId:  calculatedSprintId, results};
  }

  public static getCompletionStatus(sprintId?: string) {
    const calculatedSprintId = (sprintId) ? parseInt(sprintId, 10) : sprintHelper.getRecentSprintId();

    const results = [];
    const projectIdsToTestMap: Map <string, any> = this.getProjectIdsToTestMap(calculatedSprintId);

    // calculate the number of no-run tests in each project.
    for (const [key, value] of projectIdsToTestMap) {

      const tests = value;
      let norunCount = 0;
      const totalCount = tests.length;

      for (const t of tests) {
        if (t.status === 'NO RUN') {
          norunCount++;
        }
      }
      const project = projectHelper.getProject(key.toString());

      results.push( { project, totalTests : totalCount, completionCount : (totalCount - norunCount) });
    }

    return  { sprintId:  calculatedSprintId, results};
  }

  /**
   * Fetches the number of tests for given sprint id.
   * Then, find the projectIds for those tests and returns a map - key is projectIds and value is test objects.
   * @param sprintId
   */
  private static getProjectIdsToTestMap(sprintId: number): any {
    console.log('Calculated sprint id ', sprintId);
    const projectIdsToTestMap: Map <string, any> = new Map(); // key is projectId. Value is tests.

    if (sprintId) {

      // find all test runs for particular sprint.
      const testsOnSprint = sprintHelper.getAllTestRuns(sprintId);
      console.log('Tests in sprint ' , testsOnSprint);

      // fetch all projectIds from the test runs.
      const projectIds = testsOnSprint.map( (tr: any) => {
        return tr.projectId;
      });
      console.log('Project ids for test runs ', projectIds);

      for (const pid of projectIds) {
        const tests = testsOnSprint.filter( (tr: any) => tr.projectId === pid);
        console.log('Tests for project ' + pid + ' is : ' + tests);

        projectIdsToTestMap.set(pid, tests);
      }
    }
    return projectIdsToTestMap;

  }

}
