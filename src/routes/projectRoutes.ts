import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';
import renderer from '../renderers/renderer';

router.get('/projects.html', (req: any, res: any) => {
  // Find number of tests in each project
  const projectsWithTests = [];
  const projects = projectHelper.getAllProjects();

  for (const p of projects) {
    const tests = testHelper.getTestsForProject(p.id);
    projectsWithTests.push( { projectId: p.id, pName: p.name, testCount: tests.length});
  }
  renderer.projects(res, projectsWithTests);
});

  //
router.get('/project.*', (req: any, res: any) => {
  const projectId = req.query.projectId;
  const project = projectHelper.getProject(projectId);
  renderer.project(res, testHelper.getTestsForProject(projectId), project);
});

router.post('/project', (req: any, res: any) => {

  const idToDel = req.body.deleteTestId;
  const projectId = req.body.projectId;
  const project = projectHelper.getProject(projectId);

  console.log('Delete test(s) with id: ', idToDel );

  if (idToDel) {
    let testIds: string[] = [];

    if (Array.isArray(idToDel)) {
      console.log('Multi test delete.', idToDel);
      testIds = idToDel;
    } else {
      testIds.push(idToDel);
    }

    testHelper.removeTests(testIds);
    renderer.project(res, testHelper.getTestsForProject(projectId), project, undefined, 'Test(s) deleted successfully.');

  } else if (req.body.deleteProject) {

    console.log('Delete project with id ', projectId);
    projectHelper.removeProject(projectId);

    const projectsLst = projectHelper.getAllProjects();
    const projectsWithTests = [];

    for (const p of projectsLst) {
      const testsForProject = testHelper.getTestsForProject(p.id);
      projectsWithTests.push( { projectId: p.id, pName: p.name, testCount: testsForProject.length});
    }

    renderer.projects(res, projectsWithTests);

  } else {
      renderer.project(res, testHelper.getTestsForProject(projectId), project, 'You must select atleast one test to delete');
  }

});

router.post('/createProject', (req: any, res: any) => {

  const projects = projectHelper.getAllProjects();
  const inputName = req.body.pname;

  const jRes = projectHelper.createProject(inputName);
  const projectsWithTests = [];
  for (const p of projects) {
    const tests = testHelper.getTestsForProject(p.id);
    projectsWithTests.push( { projectId: p.id, pName: p.name, testCount: tests.length});
  }

  if (jRes.err) {
    renderer.projects(res, projectsWithTests, jRes.err.msg);

  } else {
    renderer.projects(res, projectsWithTests, undefined, jRes.successMsg);

  }

});
/*
router.post('/deleteProject', (req: any, res: any) => {
  let projectsLst = projectHelper.getAllProjects();

  const projectId = req.body.deleteProject;

  console.log('Delete project with id ', projectId);

  if (testHelper.getTestsForProject(projectId).length > 0) {
    console.log('Cannot delete project with tests');
    renderer.projects(res, projectsLst, 'Cannot delete project when it contains tests.');

  } else {
    console.log('perform delete project');
    const projectsPostDelete = projectsLst.filter( (p: any) => {
        return p.id !== projectId;
       });

    projectHelper.saveProjects(projectsPostDelete);

    projectsLst = projectHelper.getAllProjects();

    renderer.projects(res, projectsLst, undefined);

  }
}); */

export {router as projectRoutes};
