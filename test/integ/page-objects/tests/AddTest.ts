import {waitForElement, waitForAddTest} from '../common/Wait';
import Page from '../common/Page';

export default class AddTest extends Page {

  public waitToRender() {
    waitForAddTest();
    return this;
  }

  public enterDetails(title: string, desc: string, projectName: string) {
      $('#title').addValue(title);
      $('#description').addValue(desc);
      waitForElement('//select/option[normalize-space()="' + projectName + '"]',
      'Project with name' + projectName + 'not found in select dropdown.' );
      $('#project').selectByVisibleText(projectName);
      return this;
  }

  public create() {
      $('.jdamGreen').click();
      return this;
  }

  public cancel() {
    $('.jdamGrey').click();
    return this;
}
}
