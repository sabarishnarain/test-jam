import {waitForElements} from './common/Wait';

export default class Home {
  public waitToRender() {
    waitForElements(['//h3[normalize-space()="Test Results"]', 'table.jdamTable']);
  }
}
