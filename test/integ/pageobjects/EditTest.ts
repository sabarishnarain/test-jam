import {waitForElements, waitForElement} from './common/Wait';
import Page from './Page';
import Home from './Home';
import AddTest from './AddTest';
import RunTest from './RunTest';

export default class EditTest extends Page{
    public waitToLoad() {
        waitForElements(['//input[@name="title"]', '//textarea[@name="description"]', 
            '//h3[normalize-space()="Test run history"]','//h3[normalize-space()="Other tests"]']);
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

    public save() {
        $('.jdamGreen').click();
        return this;
    }

    public cancel() {
        $('.jdamGrey').click();
        return new Home().waitToLoad();
    }

    public saveAs() {
        $('//input[@name="cancelEdit"]').click();
        return new AddTest().waitToLoad();
    }

    public delete() {
        $('.jdamRed').click();
        return this;
    }

    public execute() {
        $('//input[@name="runTest"]').click();
        return new RunTest().waitToLoad();
    }


}