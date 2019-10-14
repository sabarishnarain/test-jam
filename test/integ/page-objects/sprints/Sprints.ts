import {waitForSprints} from '../common/Wait';
import Sprint from './Sprint';

export default class Sprints {
  
  public waitToRender() {
    waitForSprints();
    return this;
  }

  public getSprints() {
    const sprints = [];

    const rows = $$('.jdamTable tbody tr');

    for (const r of rows) {
      const cells = r.$$('td');
      const name = cells[1].getText();
      sprints.push( { name});
    }
    return sprints;

  }

  public createSprint(name: string) {
    $('#sprintName').clearValue();
    $('#sprintName').addValue(name);
    $('#createSprint').click();
  }

  public isSprintExists(name: string) {
    return this.getSprints().filter( (project) => {
        return project.name === name;
    }).length > 0;
  }

  public openSprint(name: string) {
    const sprint = this.getSprints().filter( (p: any) => p.name === name)[0];
    if (!sprint) {
        throw new Error('Sprint with name ' + name + ' not found!!');
    }
    $('=' + name).click();
    return new Sprint().waitToRender();
  }

}