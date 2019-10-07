import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';
import renderer from '../renderers/renderer';
import viewHelper from '../helpers/viewHelper';

// -----------------------------------------------------------------------------------------------------------
router.get('/addNewTest*', (req: any, res: any) => {
    renderer.addNewTest(res, projectHelper.getAllProjects(), undefined);
  });

  // ---------------------------------------------------------------------------------------------------------
router.post('/addNewTest*', (req: any, res: any) => {

  if (req.body.createTest) {
    const testTitle = req.body.title;
    const testDescription = req.body.description;
    const testIdentifier = req.body.identifier;

    const jres = testHelper.addTest(testTitle, testDescription, testIdentifier, req.body.project);

    if (jres.err) {
      renderer.addNewTest(res, projectHelper.getAllProjects(), req.body.project, jres.err, undefined,
      testTitle, testDescription, testIdentifier);
    } else {
      renderer.addNewTest(res, projectHelper.getAllProjects(), req.body.project, undefined,
      jres.success.msg);
    }
  } else {
    console.log('Go home');
    const data = viewHelper.getDataForHomeView(undefined , undefined);

    renderer.home(res, data.sprints, data.sprintFilter, data.projects,
      data.projectFilter, data.results);
  }

  });

export {router as addTestRoutes};
