import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';
import renderer from '../renderers/renderer';
import dashboardHelper from '../helpers/dashboardHelper';

router.get('/dashboard*', (req: any, res: any) => {
    console.log('Query is for home ', req.query);
    console.log('Params is for home ', req.params);
    const result = dashboardHelper.getData();
    renderer.dashboard(res, result);
  });

router.post('/dashboard*', (req: any, res: any) => {
  console.log('Query is for home ', req.query);
  console.log('Params is for home ', req.params);
  console.log('Body is ', req.body);

  const projectId = req.body.projectId;

  const filteredTests = testHelper.getTestsForProject(projectId);

  renderer.home(res, projectHelper.getAllProjects(), filteredTests, projectId);
});

router.get('/completion*', (req: any, res: any) => {
  const result = dashboardHelper.getData();
  renderer.completion(res, result);
});

export {router as dashboardRoutes};
