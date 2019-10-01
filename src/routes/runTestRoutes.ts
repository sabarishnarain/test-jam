import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';
import renderer from '../renderers/renderer';
import jResult from '../server/jresult';

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

    const result: jResult = testHelper.runTestById(testId, status, build);

    if (result.err) {
      renderer.runTest(res, currTest, testHelper.getStatuses(), result.err.msg);

    } else {
      currTest = testHelper.getTestById(testId);
      renderer.editTest(res, currTest, projectsList, testHelper.getHistoryForTest(testId), otherTestsInProject,
      undefined, result.successMsg);
    }

  }

});

export {router as runTestRoutes};
