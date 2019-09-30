import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';
import renderer from '../renderers/renderer';

// -----------------------------------------------------------------------------------------------------------
router.get('/addNewTest*', (req: any, res: any) => {
    renderer.addNewTest(res, projectHelper.getAllProjects(), undefined);
  });

  // ---------------------------------------------------------------------------------------------------------
router.post('/addNewTest*', (req: any, res: any) => {

  if (!req.body.createTest) {
    console.log('Go home');
    renderer.home(res, projectHelper.getAllProjects(), undefined, undefined);
    return;
  }

  if (req.body.createTest) {
    const testTitle = req.body.title;
    const testDescription = req.body.description;
    const testIdentifier = req.body.identifier;

    console.log('Title length ', testTitle.length);
    console.log('Description length', testDescription.length);

    if (testTitle.length > 200 ) {
      renderer.addNewTest(res, projectHelper.getAllProjects(), req.body.project, 'Name cannot be more than 200 chars.', undefined,
                          testTitle, testDescription, testIdentifier);
      return;
    }

    if (testDescription.length > 1300 ) {
      renderer.addNewTest(res, projectHelper.getAllProjects(), req.body.project,
                          'Description is too long. Please enter shorter description or consider splitting tests.', undefined,
                          testTitle, testDescription, testIdentifier);
      return;
    }

    if (testTitle.trim().length === 0 || testDescription.trim().length === 0) {
      renderer.addNewTest(res, projectHelper.getAllProjects(), req.body.project, 'Name or description cannot be empty');
      return;
    }

    const testId = testHelper.addTest(testTitle, testDescription, testIdentifier, req.body.project);
    renderer.addNewTest(res, projectHelper.getAllProjects(), req.body.project, undefined, `Test with id ${testId} successfully added`);
    }

  });

export {router as addTestRoutes};
