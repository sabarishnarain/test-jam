import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';
import renderer from '../renderers/renderer';

router.get('/runTest', (req: any, res: any) => {
  const testId = req.query.testId;
  console.log('Test id from GET runtest ', testId);
  const test = testHelper.getTestById(testId);
  renderer.runTest(res, test, testHelper.getStatuses());
});

router.post('/runTest', (req: any, res: any) => {
  console.log(req.body);
  const testId = req.body.testId;
  let currTest = testHelper.getTestById(testId);
  const projectsList = testHelper.getProjectsForTest(req.body.testProject);
  const otherTestsInProject  = testHelper.getTestsForProject(currTest.project);

  if (req.body.cancelRun) {

    renderer.editTest(res, currTest, projectsList, testHelper.getHistoryForTest(testId), otherTestsInProject,
                      undefined, 'Test run cancelled.');
    return;
  }

  if (req.body.runTest) {
    const status = req.body.status;
    const build = req.body.build;

    if (status && status === '-') {
      renderer.runTest(res, currTest, testHelper.getStatuses(), 'Please select a valid status');
      return;
    }

    console.log('Build is ', build);
    console.log('Build is ', build.trim().length);
    if (build.trim().length === 0) {
      renderer.runTest(res, currTest, testHelper.getStatuses(), 'Please enter a valid build');
      return;
    }

    testHelper.runTestById(testId, status, build);
    currTest = testHelper.getTestById(testId);
    renderer.editTest(res, currTest, projectsList, testHelper.getHistoryForTest(testId), otherTestsInProject,
    undefined, 'Test successfully executed.');
    return;
  }

});

export {router as runTestRoutes};
