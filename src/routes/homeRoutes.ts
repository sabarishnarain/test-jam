import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';
import renderer from '../renderers/renderer';

router.get('/', (req: any, res: any) => {
  res.redirect('/home');
});

router.get('/home*', (req: any, res: any) => {

    console.log('Home:');
    const projects = projectHelper.getAllProjects();
    const filter = req.query.projectFilter;
    const project = projectHelper.getProject(filter);
    const filteredTests = testHelper.getTestsForProject(filter);

    if (req.query.actions) {
      const actions = req.query.actions;

      if (actions === 'addTest') {
        renderer.addNewTest(res, projects, filter);
        return;
      }  else if (actions === 'deleteTest') {
        renderer.project(res, filteredTests, project);
        return;
      }
    }

    if (req.query.projectFilter) {
      console.log('Project filter ', filter );
      renderer.home(res, projects, filteredTests, filter);

    } else {
      renderer.home(res, projects, undefined, filter);
    }

  });

export {router as homeRoute};
