import Home from '../Home';
import AddTest from './AddTest';
import RunTest from './RunTest';
import Page from '../common/Page';
import {waitForElements} from '../common/Wait';

export default class EditTest extends Page {
  public waitToRender() {
    waitForElements(['#title', '#desc',
    '//h3[normalize-space()="Edit Scenario"]']);
    return this;
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
