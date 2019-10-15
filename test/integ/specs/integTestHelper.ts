import Links from '../page-objects/common/Links';
import Projects from '../page-objects/projects/Projects';
import {assert} from 'chai';

export function createProject(name: string): Projects {
  const projects: Projects = Links.projects();
  projects.enterProjectName(name).create(`Project with name ${name} successfully created.`);
  assert.isTrue(projects.isProjectExists(name));
  return projects;
}