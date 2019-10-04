import express from 'express';
const router = express.Router();
import renderer from '../renderers/renderer';
import dashboardHelper from '../helpers/dashboardHelper';

router.get('/dashboard*', (req: any, res: any) => {

  const projectId = req.query.projectId;
  const sprintFilter = req.query.sprintFilter;
  let data;

  if (projectId) {
    res.redirect('/home?sprintFilter=' + sprintFilter + '&projectFilter=' + projectId);
    return;
  }

  data = dashboardHelper.getData(sprintFilter);
  renderer.dashboard(res, data.sprintId, data.results);

});

router.get('/completion*', (req: any, res: any) => {
  const sprintFilter = req.query.sprintFilter;
  const data = dashboardHelper.getCompletionStatus(sprintFilter);
  renderer.completion(res, data.sprintId, data.results);
});

export {router as dashboardRoutes};
