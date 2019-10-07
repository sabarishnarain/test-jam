import {waitForElements, waitForElement} from './common/Wait';
import Page from './Page';
import EditTest from './EditTest';

export default class RunTest extends Page{
    public waitToLoad() {
      waitForElements(['//h3[normalize-space()="Run Test"]']);
      return this;
    }

    public enterDetails(build: string, sprint: string, status: string) {
      const statusValue = status.toUpperCase();

      $('//input[@name="build"]').addValue(build);
      waitForElement('//select[@name="sprint"]/option[normalize-space()="' + sprint + '"]',
      'Sprint "' + sprint + '" not found in select dropdown.' );

      waitForElement('//select[@name="status"]/option[normalize-space()="' + status + '"]',
      'Status with name "' + status + '" not found in select dropdown.' );
      $('//select[@name="status"]').selectByVisibleText(status);
      return this;
    }

    public getId() {
      return $('//input[@name="testId"]').getText();
    }

    public getTitle() {
      return $('//input[@name="title"]').getText();
    }

    public getIdentifier() {
      return $('//input[@name="identifier"]').getText();
    }

    public save() {
      $('.jdamGreen').click();
      return new EditTest().waitToLoad();
    }


    public cancel() {
      $('.jdamGrey').click();
      return new EditTest().waitToLoad();
    }


}