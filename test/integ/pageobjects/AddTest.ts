import {waitForElements, waitForElement} from './common/Wait';
import Page from './Page';

export default class AddTest extends Page{
    public waitToLoad() {
        waitForElements(['//input[@name="title"]', '//textarea[@name="description"]']);
        return this;
    }

    public enterDetails(title: string, desc: string, projectName: string) {
        $('//input[@name="title"]').addValue(title);
        $('//textarea[@name="description"]').addValue(desc);
        waitForElement('//select/option[normalize-space()="' + projectName + '"]',
        'Project with name' + projectName + 'not found in select dropdown.' );
        $('//select[@name="project"]').selectByVisibleText(projectName);
        return this;
    }

    public create() {
        $('.jdamGreen').click();
        return this;
    }
}