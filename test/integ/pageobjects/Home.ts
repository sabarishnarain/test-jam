import {waitForElements} from './common/Wait';
import Page from './Page';

export default class Home extends Page{
    public waitToLoad() {
        waitForElements(['//h3[normalize-space()="Test Results"]', 'table.jdamTable']);
        return this;
    }

  
}