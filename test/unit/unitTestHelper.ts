import projectHelper from '../../src/helpers/projectHelper';

export function cleanUpProjects() {
  const disposables = projectHelper.getAllProjects();

  for (const p of disposables) {
    if (p.id) {
      projectHelper.removeProject(p.id);
    }
  }
}
