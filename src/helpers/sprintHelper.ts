import dbHelper, { MODEL } from './dbHelper';
import util from '../utils/util';
import jResult from '../server/jResult';
import testHelper from './testHelper';
import projectHelper from './projectHelper';

export default class sprintHelper {

  public static addSprint(name: string) {
    let res;

    if (name.trim().length === 0) {
      res = new jResult({msg: 'Sprint name cannot be empty'});
    } else if (this.getSprintByName(name) !== undefined) {
      res = new jResult({msg: 'Sprint already exists'});
    } else {
      const sprints = this.getAllSprints();
      const sprintId = util.getMaxId(sprints) + 1;
      sprints.push({id : sprintId, name});
      this.saveContents(sprints);
      res = new jResult(undefined, 'Sprint successfully created.');
    }

    return res;
  }

  public static removeSprint(id: number) {
    const sprints = this.getAllSprints();
    const postDeleteContents = sprints.filter( (s: any) => {
        return s.id !== id;
    });
    this.saveContents(postDeleteContents);
  }

  public static getSprintById(id: number) {
      return this.getSprintsById(id)[0];
  }

  public static getSprintsById(id: number | number[]) {
    let idsArr: number[] = [] ;
    if (Array.isArray(id)) {
      idsArr = id;
    } else { idsArr.push(id); }
    console.log('Get Spring by ids ', id);
    return this.getAllSprints().filter( (s: any) => {
        return idsArr.includes(s.id);
    });
}

  public static getSprintByName(name: string) {
    return this.getAllSprints().filter( (s: any) => {
        return s.name === name;
    })[0];
}

  public static getAllSprints() {
      return dbHelper.getContents(MODEL.SPRINT);
  }

  /**
   * Returns roughly calculated of recently added sprint.
   */
  public static getRecentSprintId() {
    return this.getRecentSprint() ? this.getRecentSprint().id : undefined;
  }

  public static getSprintsForTest(testId: string) {
    const id = parseInt(testId, 10);
    const sprintIds = this.getAllTestRunContents().filter( (trc: any) => {
      return trc.testId === id;
    }).map( (res: any) => res.sprintId);
    console.log('sprint ids for test ', sprintIds);

    return sprintHelper.getSprintsById(sprintIds);
  }

  public static addTestsToSprint(testIds: number[], sprintId: number) {
    const runs = this.getAllTestRunContents();
    for (const testId of testIds) {
      const projectId = testHelper.getTestById(testId.toString()).project;
      runs.push({ testId, sprintId, status: 'NO RUN', projectId});
    }
    dbHelper.saveContents(MODEL.TESTRUN, runs);
  }

  public static removeTestsFromSprint(sprintId: number, testIds: number[]) {
    const testruns = this.getAllTestRunContents();
    const postRemovalRuns = [];
    for (const r of testruns) {
      if (testIds.includes(r.testId) && r.sprintId === sprintId) {
        // do not add in bucket
      } else {
        postRemovalRuns.push(r);
      }
    }

    dbHelper.saveContents(MODEL.TESTRUN, postRemovalRuns);
  }

  public static getAllTestRuns(sprintId?: number) {

    if (sprintId) {
      return this.getAllTestRunContents().filter( (tr: any) => {
        return tr.sprintId === sprintId;
      });
    }
    return this.getAllTestRunContents();

  }

  public static getAllOtherTestsNotInSprint(sprintId: number) {
    const idsOfTestRuns = this.getAllTestRuns(sprintId).map ( (tr: any) => {
      return tr.testId;
    });
    const allTests = testHelper.getAllTests();
    const testsNotInSprint = [];

    for (const t of allTests) {
      if (!idsOfTestRuns.includes(t.id)) {
        testsNotInSprint.push( {id: t.id, title : t.title, projectId: t.project});
      }
    }

    // now loop through the test and fetch project names.
    const results = [];
    for (const i of testsNotInSprint) {
      const project = projectHelper.getProject(i.projectId.toString());
      results.push( {id: i.id, title : i.title, projectName: project.name});
    }

    return results;

  }

  /**
   * Returns roughly calculated of recently added sprint.
   */
  private static getRecentSprint() {
    return this.getAllSprints().reverse()[0];
  }

  private static getAllTestRunContents() {
    return dbHelper.getContents(MODEL.TESTRUN);

  }

  private static saveContents(contents: any) {
      dbHelper.saveContents(MODEL.SPRINT, contents);
  }
}
