import {waitForElements, waitForElement} from '../common/Wait';
import Page from '../common/Page';
import EditTest from './EditTest';

export default class RunTest extends Page {

  public waitToRender() {
    waitForElements(['//h3[normalize-space()="Run Test"]']);
    return this;
  }

  public enterDetails(build: string, sprint: string, status: string) {
    const statusValue = status.toUpperCase();

    $('#build').addValue(build);
    waitForElement('//select[@name="sprint"]/option[normalize-space()="' + sprint + '"]',
    'Sprint "' + sprint + '" not found in select dropdown.' );
    $('#sprint').selectByVisibleText(sprint);

    waitForElement('//select[@name="status"]/option[normalize-space()="' + status + '"]',
    'Status with name "' + status + '" not found in select dropdown.' );
    $('#status').selectByVisibleText(status);
    return this;
  }

  public getId() {
    return $('//#testId').getText();
  }

  public getTitle() {
    return $('#title').getText();
  }

  public getIdentifier() {
    return $('#identifier').getText();
  }

  public save() {
    $('.jdamGreen').click();
    return new EditTest().waitToRender();
  }

  public cancel() {
    $('.jdamGrey').click();
    return new EditTest().waitToRender();
  }

 }
