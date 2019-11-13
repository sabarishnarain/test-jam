import sprintHelper from './sprintHelper';
import dbHelper, { MODEL } from './dbHelper';

export default class testrunHelper {
  public static updateTestrunById(testId: number, status: string, sprintId: number, build: string, lastUpdated: any,
                                  lastUpdatedBy: string) {
    console.log('updateTestrunById ', testId, status, sprintId);
    const testruns = sprintHelper.getAllTestRuns();
    for (const tr of testruns) {
        if (tr.testId === testId && tr.sprintId === sprintId) {
            tr.status = status;
            tr.build = build;
            tr.lastUpdated = lastUpdated;
            tr.lastUpdatedBy = lastUpdatedBy;
        }
      }
    dbHelper.saveContents(MODEL.TESTRUN, testruns);
  }

  public static removeTestRuns(id: number) {
    const runs = sprintHelper.getAllTestRuns();
    const postDeleteContents = runs.filter( (tr: any) => {
        return id !== tr.testId;
    });
    dbHelper.saveContents(MODEL.TESTRUN, postDeleteContents);
  }
}
