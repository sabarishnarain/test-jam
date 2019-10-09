import { expect } from 'chai';
import chai from 'chai';
import sprintHelper from '../../src/helpers/sprintHelper';
import {initializeDB} from '../../src/server/env';

// tslint:disable-next-line: no-var-requires
chai.use(require('chai-string'));

describe('Sprint Helper Tests', () => {

  before( () => {
    initializeDB();
  });

  it('Get sprint by invalid name should be null', () => {
    expect(sprintHelper.getSprintByName('foobar')).to.be.undefined;
  });

  it('Add sprint by empty name', () => {
    const jres = sprintHelper.addSprint(' ');
    expect(jres.err).to.not.be.undefined;
  });

  it('Duplicate sprint', () => {
    let jres = sprintHelper.addSprint('helloworld');
    expect(jres.err).to.be.undefined;
    jres = sprintHelper.addSprint('helloworld');
    expect(jres.err).to.not.be.undefined;
  });

  it('Add and delete sprint', () => {
    const jres = sprintHelper.addSprint('helloworld');
    expect(jres.err).to.be.undefined;
    const sprint = sprintHelper.getSprintByName('helloworld');
    sprintHelper.removeSprint(sprint.id);
    expect(sprintHelper.getSprintById(sprint.id)).to.be.undefined;
  });

  it('Get multiple sprints by id', () => {
    let jres = sprintHelper.addSprint('helloworld');
    const sprint1 = sprintHelper.getSprintByName('helloworld');

    expect(jres.err).to.be.undefined;
    jres = sprintHelper.addSprint('sudosprint');
    expect(jres.err).to.be.undefined;
    const sprint2 = sprintHelper.getSprintByName('sudosprint');

    const sprints = sprintHelper.getSprintsById([sprint1.id, sprint2.id]);
    expect(sprints.length).to.equal(2);
  });


  beforeEach( () => {
    cleanUpSprints();
  });

  afterEach( () => {

    cleanUpSprints();

    });

  function cleanUpSprints() {
    const disposables = ['helloworld'];

    for (const p of disposables) {
      const sprint = sprintHelper.getSprintByName(p);
      if (sprint) {
        sprintHelper.removeSprint(sprint.id);
      }
    }
  }

});
