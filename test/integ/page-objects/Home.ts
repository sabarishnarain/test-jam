import {waitForElements} from './common/Wait';
import Page from './common/Page';

export default class Home extends Page {

  public waitToRender() {
    waitForElements(['//h3[normalize-space()="Test Results"]', 'table.jdamTable']);
    return this;
  }
}
