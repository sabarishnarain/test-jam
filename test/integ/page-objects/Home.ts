import {waitForHome} from './common/Wait';
import Page from './common/Page';
import EditTest from './tests/EditTest';

export default class Home extends Page {

  public waitToRender() {
    waitForHome();
    return this;
  }

  public selectSprint(sprintname: string) {
    $('#sprintFilter').selectByVisibleText(sprintname);
    $$('.jdamGreen')[0].click();

  }

  public selectProject(projectname: string) {
    $('#projectFilter').selectByVisibleText(projectname);
    $$('.jdamGreen')[1].click();


  }

  public getTests() {
    const tests = [];
    const rows = $$('.jdamTable tbody tr');

    for (const r of rows) {
      const cells = r.$$('td');
      const id =          cells[0].$('a').getText();
      const title =       cells[1].getText();
      const identifier =  cells[2].getText();
      const status =      cells[3].getText();
      const build =       cells[4].getText();
      const lastUpdated = cells[5].getText();

      tests.push( { id, title, identifier, status, build, lastUpdated});
    }
    return tests;
  }

  public isTestExistsWithTitle(title: string): boolean {
    return this.getTestWithTitle(title) !== undefined;
  }

  public getTestWithTitle(title: string): any {
    return this.getTests().filter( (t) => { return t.title === title; })[0];
  }

  public openTest(testId: number): EditTest {
    $('=' + testId).click();
    return new EditTest().waitToRender();
  }
}
