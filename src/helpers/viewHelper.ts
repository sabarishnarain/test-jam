import sprintHelper from './sprintHelper';
import projectHelper from './projectHelper';
import testHelper from './testHelper';

export default class viewHelper {

  public static getDataForHomeView(sprintFilter: any, projectFilter: string) {
    console.log('Project filter ', projectFilter);

    const sprints = sprintHelper.getAllSprints();
    if (sprintFilter) {
        sprintFilter = parseInt(sprintFilter, 10);
    } else {

        sprintFilter = sprintHelper.getRecentSprintId();
    }
    console.log('Sprint filter ', sprintFilter);

    const allTestsInSprints = sprintHelper.getAllTestRuns(sprintFilter);
    console.log('allTestsInSprints  ', allTestsInSprints);

    let testsInSprint = [];
    if (projectFilter && allTestsInSprints.length > 0) {
      testsInSprint = allTestsInSprints.filter( (testrun: any) => {
        return testrun.projectId === projectFilter; });
    } else {
      testsInSprint = allTestsInSprints;
    }

    console.log('Results ', testsInSprint);

    const projectIdsForTestsInSprint = allTestsInSprints.map( (testrun: any) => {
      return testrun.projectId;
    });

    console.log('projectIdsForTestsInSprint ', projectIdsForTestsInSprint);

    const projects = projectHelper.getAllProjects().filter( (p: any) => {
      return projectIdsForTestsInSprint.includes(p.id);
    });

    console.log('projects ', projects);
    const tests = [];
    for (const t of testsInSprint) {
      const test = testHelper.getTestById(t.testId);
      if (test) {
        tests.push({testId: test.id, title : test.title, status: t.status});
      }
    }
    console.log('Test objects ', tests);

    return { sprints, sprintFilter, projects, projectFilter, results: tests};
    }

}
