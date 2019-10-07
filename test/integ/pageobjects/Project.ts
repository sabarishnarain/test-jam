import Projects from "./Projects";
import {waitForElements, waitForElement} from './common/Wait';
import EditTest from './EditTest';

export default class Project {

  public waitToLoad() {
    waitForElements(['#page-wrapper']);
    return this;
  }

  deleteProject() {
    $('//input[@name="deleteProject"]').click();
    return new Projects().waitToLoad();
  }

  deleteTest() {
    $('//input[@name="deleteTest"]').click();
    return this.waitToLoad();
  }

  getTests() {
    const tests = [];

    const rows = $$('.jdamTable tbody tr');

    for (const r of rows) {
      const cells = r.$$('td');
      const title = cells[1].getText();
      const desc = cells[2].getText();
      const testId = cells[3].getText();
      const identifier = cells[4].getText();

      tests.push( { title, desc, testId, identifier});
    }
    console.log(tests)
    return tests;
  }

  isTestExistsById(testId: string) {
    return this.getTests().filter( (t) => t.testId === testId).length > 0;
  }

  isTestExistsByTitle(title: string) {
    return this.getTests().filter( (t) => t.title === title).length > 0;
  }

  /**
   * 
   * @param title 
   */
  openTestByTitle(title: string) {
    const test = this.getTests().filter( (t: any) => t.title === title)[0];
    if (!test) {
      throw new Error('Test with name ' + name + ' not found!!');
    }
    $('=' + test.testId).click();
    return new EditTest().waitToLoad();
  }

  openTestByIdentifier(identifier: string) {
    const test = this.getTests().filter( (t: any) => t.identifier === identifier)[0];
    if (!test) {
      throw new Error('Test with name ' + name + ' not found!!');
    }
    $('=' + test.testId).click();
    return new EditTest().waitToLoad();
  }

  selectTests(title: string[]) {
    const rows = $$('.jdamTable tbody tr');

    for (const r of rows) {
      const cells = r.$$('td');

      if (title.includes(cells[1].getText())) {
        cells[5].$('input').click();
      }
     }
    return this;
  }

  selectAllTests() {
    $('#selectAll').click();
    return this;
  }
}