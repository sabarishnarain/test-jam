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

  public static addTest(title: string, desc: string, identifier: string, projectId: string): jResult {

    const validationRes = this.validateTestInput(title, desc, projectId);
    if ( !validationRes) {
      const contents = this.getAllTests();
      const recentId = testHelper.getRecentId();
      const testId = recentId + 1;
      contents.push( { id : testId,
                       title,
                       desc,
                       identifier,
                       project : projectId });
      dbHelper.saveContents(MODEL.TEST, contents);

      return new jResult(undefined,
         { msg: 'Test with id <a href="editTest.html?testId=' + testId + '"> ' + testId + '</a> successfully added',
           testId });
    } else {
      return new jResult(validationRes);
    }

  }

  public static updateTestContents(id: number, title?: string, desc?: string, identifier?: string,
                                   projectId?: string): jResult {

    const project = projectHelper.getProject(projectId);
    const validationRes = this.validateTestInput(title, desc, (project) ? project.id : undefined);
    let jRes: jResult;

    if (!validationRes) {
      const tests = testHelper.getAllTests();
      let isTestFound = false;

      for (const t of tests) {
        if (t.id === id) {
          console.log('update test');
          isTestFound = true;

          if (title) {
            t.title = title;
          }
          if (desc) {
            t.desc  = desc;
          }
          if (identifier) {
            t.identifier = identifier;
          }
          break;
        }
      }
      if (isTestFound) {
        dbHelper.saveContents(MODEL.TEST, tests);
        jRes =  new jResult(undefined, 'Test successfully updated');
      } else {
        jRes = new jResult('Test update content failed. Test ' + id + ' not found');
      }

    } else {
      jRes = new jResult(validationRes);
    }

    return jRes;

  }

  /**
   * Creates a test run in testruns.json and add history entry im history/test-XX.json.
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
        // this.updateTestById(testId);
        testrunHelper.updateTestrunById(testId, status, sprintID, build, lastUpdated);
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
  public static runTestByIndentifier(identifier: string, projectId: string, build: string, status: string, sprintId: string): boolean {
    const tests = testHelper.getAllTests();
    let isTestFound = false;
    let testId;
    const sprintID = parseInt(sprintId, 10);

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
      testHelper.addHistory(testId, status, build, lastUpdated);
      testrunHelper.updateTestrunById(testId, status, sprintID, build, lastUpdated);
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

  private static validateTestInput(title: string, desc: string, projectId: string): any {
    console.log('Validate input', title, desc, projectId);
    if (title.trim().length === 0 || desc.trim().length === 0) {
      return 'Name or description cannot be empty';
    } else if (title.length > 200 ) {
      return 'Name cannot be more than 200 chars.';
    } else if (desc.length > 1300 ) {
      return 'Description is too long. Please enter shorter description or consider splitting tests.';
    } else if (!projectId || (projectId && projectId.trim().length === 0) ||
          !projectHelper.getProject(projectId)) {
      return 'Whoops! The project you used does not exist in the system anymore. Please try again';
    }
    return undefined;
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
