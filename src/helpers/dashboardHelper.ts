import testHelper from './testHelper';
import projectHelper from './projectHelper';

export default class dashboardHelper {

  public static getData() {
    const projects = projectHelper.getAllProjects();
    const result = [];

    const projectsToTestMap: Map <string, any> = new Map();

    for (const p of projects) {
      const tests = testHelper.getTestsForProject(p.id);
      projectsToTestMap.set(p.id, tests);
    }

    for (const [key, value] of projectsToTestMap) {

        let passCount = 0;
        let failCount = 0;

        const tests = value;

        for (const t of tests) {
            if (t.status === 'PASS') {
                passCount++;
            } else if (t.status === 'FAIL') {
                failCount++;
            }
        }
        const project = projectHelper.getProject(key);

        result.push( { project, pass : passCount, fail: failCount, norun : tests.length - (passCount + failCount) });

    }
    return result;
  }

}
