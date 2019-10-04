import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import viewHelper from '../helpers/viewHelper';
import renderer from '../renderers/renderer';
import sprintHelper from '../helpers/sprintHelper';

router.get('/', (req: any, res: any) => {
  res.redirect('/home');
});

router.get('/home*', (req: any, res: any) => {

   console.log(req.query);
   const projectFilter = req.query.projectFilter;
   const sprintFilter = req.query.sprintFilter;
   console.log('Sprint filter before ', sprintFilter);

   const data = viewHelper.getDataForHomeView(sprintFilter, projectFilter);

   renderer.home(res, data.sprints, data.sprintFilter, data.projects,
                  data.projectFilter, data.results);

  });

export {router as homeRoute};
