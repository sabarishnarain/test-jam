import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';

import renderer from '../renderers/renderer';
import jResult from '../server/jResult';
import sprintHelper from '../helpers/sprintHelper';

router.get('/runTest', (req: any, res: any) => {
  const testId = req.query.testId;
  console.log('Test id from GET runtest ', testId);
  const test = testHelper.getTestById(testId);
  renderer.runTest(res, test, testHelper.getStatuses(), sprintHelper.getSprintsForTest(testId));
});

router.post('/runTest', (req: any, res: any) => {
  console.log(req.body);
  const testId = req.body.testId;
  let currTest = testHelper.getTestById(testId);
  const project =  projectHelper.getProject(currTest.project);
  const otherTestsInProject  = testHelper.getTestsForProject(currTest.project);

  if (req.body.cancelRun) {

    renderer.editTest(res, currTest, project, testHelper.getHistoryForTest(testId), otherTestsInProject,
                      undefined, 'Test run cancelled.');
    return;
  }

  if (req.body.runTest) {
    const status = req.body.status;
    const build = req.body.build;
    const sprintId = req.body.sprint;

    const result: jResult = testHelper.runTestById(testId, status, build, sprintId, req.session.username);

    if (result.err) {
      // error
      renderer.runTest(res, currTest, testHelper.getStatuses(), sprintHelper.getSprintsForTest(testId), result.err.msg);

    } else {
      // success
      currTest = testHelper.getTestById(testId);
      renderer.editTest(res, currTest, project, testHelper.getHistoryForTest(testId), otherTestsInProject,
      undefined, result.success);
    }

  }

});

export {router as runTestRoutes};
