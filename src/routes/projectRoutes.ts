import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';
import renderer from '../renderers/renderer';

router.get('/projects.html', (req: any, res: any) => {
  renderer.projects(res);
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
  const deleteTest = req.body.deleteTest;
  const addTest = req.body.addTest;

  if (addTest) {
    renderer.addNewTest(res, projectHelper.getAllProjects(), projectId);
    return;
  }

  const project = projectHelper.getProject(projectId);

  console.log('Delete test(s) with id: ', idToDel );

  if (idToDel && deleteTest) {
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

    renderer.projects(res);

  } else {
      renderer.project(res, testHelper.getTestsForProject(projectId), project, 'You must select atleast one test to delete');
  }

});

router.post('/createProject', (req: any, res: any) => {

  let projects = projectHelper.getAllProjects();
  const inputName = req.body.pname;

  const jRes = projectHelper.createProject(inputName);

  if (jRes.err) {
    renderer.projects(res, jRes.err.msg);
  } else {
    projects = projectHelper.getAllProjects();
    renderer.projects(res, undefined, jRes.successMsg);

  }

});

export {router as projectRoutes};
