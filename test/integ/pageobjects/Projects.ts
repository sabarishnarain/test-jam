import {waitForElements} from './common/Wait';
import AddTest from './AddTest';
import Project from './Project';
import Page from './Page';

export default class Projects extends Page{
    public waitToLoad() {
        waitForElements(['//h3[normalize-space()="Projects"]', '//input[@name="pname"]']);
        return this;
    }

    public enterProjectName(name: string) {
        $('//input[@name="pname"]').addValue(name);
        return this;
    }

    public create() {
        $('.jdamGreen').click();
        return this;
    }

    public getProjects() {
        const projects = [];

        const rows = $$('.jdamTable tbody tr');

        for (const r of rows) {
            const cells = r.$$('td');
            const name = cells[1].getText();
            const id = cells[2].getText();
            const testCount = cells[3].getText();
            projects.push( { name, id, testCount});
        }
        console.log(projects)
        return projects;

    }


    public isProjectExists(name: string) {
        return this.getProjects().filter( (project) => {
            return project.name === name;
        }).length > 0;
    }

    public openProject(name: string) {
        const project = this.getProjects().filter( (p: any) => p.name === name)[0];
    if (!project) {
        throw new Error('Project with name ' + name + ' not found!!');
    }
        $('=' + name).click();
        return new Project().waitToLoad();
    }
}