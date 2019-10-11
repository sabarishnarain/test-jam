import { timingSafeEqual } from "crypto";

export default class Sprint {
  
  public waitToRender() {
    return this;
  }

  public getTestsInSprint() {
    return this.getTableContents(0);
  }


  public getOtherTests() {
    return this.getTableContents(1);
  }

  private getTableContents(tableIndex: number) {
    const tests = [];

    const rows = $$('.jdamTable')[tableIndex].$$('tbody tr');

    for (const r of rows) {
      const cells = r.$$('td');
      const title = cells[1].getText();
      const project = cells[2].getText();
      tests.push( { title, project});
    }
    return tests;

  }

  public addTestsToSprint(titles: string[]) {
    this.selectTestsFromTable(1, titles);
    $('#addTestsToSprint').click();
  }

  public removeTestsFromSprint(titles: string[]) {
    this.selectTestsFromTable(0, titles);
    $('#removeTestsFromSprint').click();
  }

  public selectTestsFromTable(tableIndex: number, titles: string[]) {
    const rows = $$('.jdamTable')[tableIndex].$$('tbody tr');
    for (const r of rows) {
      const cells = r.$$('td');
      if (titles.includes(cells[1].getText())) {
          cells[3].$('input').click();
      }
    }
  }


}