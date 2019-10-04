import dbHelper, { MODEL } from './dbHelper';
import util from '../utils/util';
import fs from 'fs';
import fsx from 'fs-extra';
import projectHelper from './projectHelper';
import jResult from '../server/jResult';
import testrunHelper from './testrunHelper';

export default class testHelper {

  public static getAllTests(optimized: boolean = false) {
   const tests = dbHelper.getContents(MODEL.TEST);
   if (optimized) {
     for (const t of tests) {
       if (t.title.length >= 200) {
         t.title = t.title.substring(0, 200) + '...';
       }
       if (t.desc.length >= 200) {
         t.desc = t.desc.substring(0, 200) + '...';
       }
     }
   }

   return tests;
  }

  public static getTestById(id: string): any {
    const test = this.getAllTests().filter( (t: any) => {
      return t.id === parseInt(id, 10);
    });
    return test[0];
  }

  public static getTestsForProject(projectId: string) {
    const tests = this.getAllTests(true);

    return tests.filter( (t: any) => {
        return t.project === projectId;
    });
  }

  public static addTest(title: string, desc: string, identifier: string, projectId: string): number {
    const contents = this.getAllTests();
    const recentId = testHelper.getRecentId();

    contents.push( { id : recentId + 1,
      title,
      desc,
      status : '',
      identifier,
      build: '',
      project : projectId });
    dbHelper.saveContents(MODEL.TEST, contents);
    return recentId + 1;
  }

  public static updateTestById(id: number, status: string, title?: string, desc?: string, identifier?: string,
                               build?: string, projectId?: string, lastUpdated?: any): boolean {
    const tests = testHelper.getAllTests();
    let isTestFound = false;
    status = this.lookupStatus(status);

    for (const t of tests) {

      if (t.id === id) {
        console.log('update test');
        isTestFound = true;
        t.status = status;

        if (title) {
          t.title = title;
        }
        if (desc) {
          t.desc  = desc;
        }
        if (identifier) {
          t.identifier = identifier;
        }
        if (projectId) {
          t.project = projectId;
        }
        if (build) {
          t.build = build;
        }
        if (lastUpdated) {
          t.lastUpdated = lastUpdated;
        }

      }
    }

    if (isTestFound) {
      dbHelper.saveContents(MODEL.TEST, tests);
    }

    return isTestFound;
  }

  /**
   * Creates a test run by id.
   * @param id
   * @param status
   * @param build
   */
  public static runTestById(id: string, status: string, build: string, sprintId: string): any {

    let res: jResult;
    status = this.lookupStatus(status);

    const testId = parseInt(id, 10);
    const sprintID = parseInt(sprintId, 10);

    if (status === '-' ) {
      res = new jResult({msg : 'Please select a valid status'}, undefined);
    } else if (build.trim().length === 0) {
      res = new jResult({ msg : 'Please enter a valid build'});
    } else {
      const tests = testHelper.getAllTests();
      let isTestFound = false;

      status = this.lookupStatus(status);
      for (const t of tests) {
        if (t.id === testId) {
          console.log('update test');
          isTestFound = true;
        }
      }

      if (isTestFound) {
        const lastUpdated = new Date();
        testHelper.addHistory(testId, status, build, lastUpdated);
        this.updateTestById(testId, status, undefined, undefined, undefined, build, undefined, lastUpdated);
        testrunHelper.updateTestrunById(testId, status, sprintID);
        res = new jResult(undefined, 'Test successfully executed');
      } else {
        res = new jResult({msg: 'Test not found'});
      }

    }
    return res;

  }

  /**
   * Creates a  test run with identifier and project id.
   * @param identifier
   * @param projectId
   * @param status
   */
  public static runTestByIndentifier(identifier: string, projectId: string, build: string, status: string): boolean {
    const tests = testHelper.getAllTests();
    let isTestFound = false;
    let testId;

    status = this.lookupStatus(status);

    for (const t of tests) {
      if (t.identifier === identifier && t.project === projectId) {
        isTestFound = true;
        t.status = status;
        t.build = build;
        testId = t.id;
        break;
      }
    }

    if (isTestFound) {
      const lastUpdated = new Date();
      dbHelper.saveContents(MODEL.TEST, tests);
      testHelper.addHistory(testId, status, build, lastUpdated);
    }

    return isTestFound;
  }

  public static removeTests(testIdsArr: string[]) {
    // Convert all test ids to integer array
    const idsToInteger = testIdsArr.map( (id) => {
      return parseInt(id, 10);
    });

    const testsPostDelete = this.getAllTests().filter( (t: any) => {
      return !idsToInteger.includes(t.id);
    });

    // remove history one by one
    for (const id of idsToInteger) {
      testHelper.removeHistory(id);
    }

    dbHelper.saveContents(MODEL.TEST, testsPostDelete);

  }

  /**
   * Get all projects along with the project id associated with the test,
   * and return array of string - where each item is
   * <projectid>#<projectname>#<isSelected>
   * @param projectId
   */
 public static getProjectsForTest(projectId: string): string[] {
    const projects = projectHelper.getAllProjects();
    const projectsList = [];
    for (const p of projects) {
      const isSelected = (p.id === projectId);
      projectsList.push(p.id + '#' + p.name + '#' + isSelected);
    }
    return projectsList;
  }

  /**
   * Get most recent id for project from data.json
   * @param tests
   */
  public static getRecentId() {
    return util.getMaxId(this.getAllTests());
  }

  public static getStatusesForTest(testId: string): string[] {
    console.log('Get statuses for test: ', testId);
    const test = this.getTestById(testId);
    const statusList = [];
    statusList.push('NORUN#NORUN#' + (test.status === 'NORUN'));
    statusList.push('PASS#PASS#' + (test.status === 'PASS'));
    statusList.push('FAIL#FAIL#' + (test.status === 'FAIL'));
    return statusList;
  }

  public static getStatuses(): string[] {
    console.log('Get statuses');
    const statusList = [];
    statusList.push('-#--Select--');
    statusList.push('pass#PASS');
    statusList.push('fail#FAIL');
    return statusList;
  }

  public static addHistory(testId: number, status: string, build: string, date: any): void {
    const fsHistoryJSON = dbHelper.getDataFileForTestHistory(testId);

    let contents;

    if (!fs.existsSync(fsHistoryJSON)) {
      console.log('File ' + fsHistoryJSON + '.json does not exist.');
      fsx.ensureFileSync(fsHistoryJSON);
      contents = [];
    } else {
      console.log('File test-' + testId + '.json exist.');
      contents = JSON.parse(fs.readFileSync(fsHistoryJSON, 'utf-8'));

    }
    contents.push({ testId, status, build, date});
    fs.writeFileSync(fsHistoryJSON, JSON.stringify(contents));
  }

  public static getHistoryForTest(testId: number) {
    const fsHistoryJSON = dbHelper.getDataFileForTestHistory(testId);
    let historyContents;
    if (fs.existsSync(fsHistoryJSON)) {
      historyContents = JSON.parse(fs.readFileSync(fsHistoryJSON, 'utf-8')).reverse();
    } else {
      historyContents = [];
    }
    return historyContents;
  }

  public static removeHistory(testId: number) {
    const fsHistoryJSON = dbHelper.getDataFileForTestHistory(testId);
    if (fs.existsSync(fsHistoryJSON)) {
      console.log('Remove history ' + testId);
      fs.unlinkSync(fsHistoryJSON);
    }

  }

  public static searchTests(keyword: string) {
    return this.getAllTests().filter( (t: any) => {
      return t.testname.includes(keyword) || t.scenario.includes(keyword);
    });
  }

  public static isValidStatus(status: string): boolean {
    const statuses = ['PASS', 'FAIL', 'NORUN', 'DEPRECATED', 'PASSED', 'FAILED'];
    return statuses.includes(status.toUpperCase());
  }

  /**
   * Returns a valid status name by removing tailing 'ED'.
   * Frameworks such as junit use statuses as PASSED or FAILED that needs to be trimmed a bit.
   * @param status
   */
  private static lookupStatus(status: string): string {

    if (status) {
      status = status.toUpperCase();
      if (status === 'PASSED') {
        status = 'PASS';
      } else if (status === 'FAILED') {
        status = 'FAIL';
      }
      return status;
    }
    return '';

  }

}
