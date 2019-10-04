import sprintHelper from './sprintHelper';
import dbHelper, { MODEL } from './dbHelper';

export default class testrunHelper {
  public static updateTestrunById(testId: number, status: string, sprintId: number, build: string, lastUpdated: any) {
    console.log('updateTestrunById ', testId, status, sprintId);
    const testruns = sprintHelper.getAllTestRuns();
    for (const tr of testruns) {
        if (tr.testId === testId && tr.sprintId === sprintId) {
            tr.status = status;
            tr.build = build;
            tr.lastUpdated = lastUpdated;
        }
      }
    dbHelper.saveContents(MODEL.TESTRUN, testruns);
  }
}
