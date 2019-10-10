import Session from '../page-objects/Session';
import {assert} from 'chai';
import Projects from '../page-objects/projects/Projects';
import Project from '../page-objects/projects/Project';
import Links from '../page-objects/common/Links';

describe('Project usecases', () => {
  it('Create & Delete Project', () => {
      const home = Session.init().loginAs();

      let projects: Projects = Links.projects();
      const PROJECT_NAME = 'tempproject';

      // clean up existing projects if present
      if (projects.isProjectExists(PROJECT_NAME)) {
          projects = projects.openProject(PROJECT_NAME).deleteProject();
      }
      assert.isFalse(projects.isProjectExists(PROJECT_NAME));

      projects.enterProjectName(PROJECT_NAME).create();
      assert.isTrue(projects.isProjectExists(PROJECT_NAME));

      const project: Project = projects.openProject(PROJECT_NAME);
      project.deleteProject();
      assert.isFalse(projects.isProjectExists(PROJECT_NAME));

     });

 }) 