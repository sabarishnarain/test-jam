import Home from '../Home';
import AddTest from './AddTest';
import RunTest from './RunTest';
import Page from '../common/Page';
import {waitForElements} from '../common/Wait';
import TestHistoryList from './TestHistoryList';
import TestHistory from './TestHistory';
import OtherTest from './OtherTest';
import OtherTestList from './OtherTestList';

export default class EditTest extends Page {

  public waitToRender() {
    waitForElements(['#title', '#desc', '//h3[normalize-space()="Edit Scenario"]']);

    return this;
  }

  public getHistoryList() {
    const historyLst: TestHistory[] = [];
    const testHistoryRows = $$('#testHistoryPanel table tbody tr');
    let counter = 0;
    for (const r of testHistoryRows) {
      const cells = r.$$('td');
      const status = (cells[1].$('img').getAttribute('src') === '/checked.png') ? 'PASS' : 'FAIL';
      historyLst.push( new TestHistory(counter, status, cells[2].getText(), cells[3].getText()));
      counter++;
    }
    return new TestHistoryList(historyLst);
  }

  public getOtherTestList() {
    $('#otherTestsBtn').click();
    const otherTestLst: OtherTest[] = [];
    const rows = $$('#otherDataPanel table tbody tr');
    let counter = 0;
    for (const r of rows) {
      const cells = r.$$('td');
      otherTestLst.push( new OtherTest(counter, cells[1].getText(), cells[2].getText()));
      counter++;
    }
    return new OtherTestList(otherTestLst);
  }

  /**
   * Open test from "Other Tests" section with id
   */
  public openTest(testId: string) {
    $('#otherTestsBtn').click();
    $('#otherDataPanel').$('=' + testId).click();
    return new EditTest().waitToRender();
  }

  public enterDetails(title: string, desc: string) {
    $('#title').clearValue();
    $('#desc').clearValue();
    $('#title').addValue(title);
    $('#desc').addValue(desc);
    return this;
  }

  public getTitle() {
    return $('#title').getValue();
  }

  public getDescription() {
    return $('#desc').getText();
  }

  public save() {
    $('.jdamGreen').click();
    return this;
  }

  public cancel() {
    $('.jdamGrey').click();
    return new Home().waitToRender();
  }

  public saveAs() {
    $('#saveTest').click();
    return new AddTest().waitToRender();
  }

  public delete(accept: boolean): any {
    $('.jdamRed').click();
    if (accept) {
      browser.acceptAlert();
      const home = new Home().waitToRender();
      home.matchSnackbar('Test successfully deleted.');
      return home;
    }

    browser.dismissAlert();
    return this;
  }

  public execute() {
    $('#runTest').click();
    return new RunTest().waitToRender();
  }

 }
