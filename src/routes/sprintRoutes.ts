import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import renderer from '../renderers/renderer';
import sprintHelper from '../helpers/sprintHelper';
import jResult from '../server/jResult';

router.get('/sprints*', (req: any, res: any) => {
  renderer.sprints(res, sprintHelper.getAllSprints());
});

function getTestObjectsForSprintView(sprintId: string) {
  const testRunsForSprint = sprintHelper.getAllTestRuns(parseInt(sprintId, 10));
  const tests = [];
  for (const tr of testRunsForSprint) {
    const testId = tr.testId;
    const testObject = testHelper.getTestById(testId.toString());
    if (testObject) {
      tests.push({id: testObject.id, title: testObject.title, status: testObject.status});
    }
  }
  return tests;
}

router.get('/sprint.html', (req: any, res: any) => {
  const sprintId = req.query.sprintId;

  const allOtherTests = sprintHelper.getAllOtherTestsNotInSprint(parseInt(sprintId, 10));
  const sprint = sprintHelper.getSprintById(parseInt(sprintId, 10));
  renderer.sprint(res, sprint, getTestObjectsForSprintView(sprintId), allOtherTests);
});

router.post('/createSprint', (req: any, res: any) => {

  const sprintName = req.body.sprintName;
  if (req.body.createSprint) {
       const jRes: jResult = sprintHelper.addSprint(sprintName);
       if (jRes.err) {
        renderer.sprints(res, sprintHelper.getAllSprints(), jRes.err.msg);
       } else {
        renderer.sprints(res, sprintHelper.getAllSprints(), undefined, jRes.successMsg);
       }
  }

});

function addTestsToSprint(testIds: string[]| string, sprintId: string) {

  let testIdsImmutable: number[] = [];
  if (Array.isArray(testIds)) {
    testIdsImmutable = testIds.map( (id) => {
      return parseInt(id, 10);
    });
  } else {
    testIdsImmutable.push(parseInt(testIds, 10));
  }

  sprintHelper.addTestsToSprint(testIdsImmutable, parseInt(sprintId, 10));
}

router.post('/addTestsToSprint', (req: any, res: any) => {

  const addAction = req.body.addTestsToSprint;
  const testsIdsToAddToSprint = req.body.addTestToSprint;

  if (addAction ) {
    const sprintId = req.body.sprintId;

    if (testsIdsToAddToSprint) {
      addTestsToSprint(testsIdsToAddToSprint, sprintId);

      const allOtherTests = sprintHelper.getAllOtherTestsNotInSprint(parseInt(sprintId, 10));
      const sprint = sprintHelper.getSprintById(parseInt(sprintId, 10));

      renderer.sprint(res, sprint, getTestObjectsForSprintView(sprintId), allOtherTests);
    } else {
            // user has not selected any rows

      const allOtherTests = sprintHelper.getAllOtherTestsNotInSprint(parseInt(sprintId, 10));
      const sprint = sprintHelper.getSprintById(parseInt(sprintId, 10));

      renderer.sprint(res, sprint, getTestObjectsForSprintView(sprintId), allOtherTests, 'You must select atleast one test to add to sprint.');

    }

  }

});

function removeTestsFromSprint( sprintId: string, testIds: string[]| string) {

  console.log('Remove tests ' + testIds + ' from sprint ' + sprintId);

  let testIdsImmutable: number[] = [];
  if (Array.isArray(testIds)) {
    testIdsImmutable = testIds.map( (id) => {
      return parseInt(id, 10);
    });
  } else {
    testIdsImmutable.push(parseInt(testIds, 10));
  }

  sprintHelper.removeTestsFromSprint(parseInt(sprintId, 10), testIdsImmutable);
}

router.post('/removeTestsFromSprint', (req: any, res: any) => {

  const removeAction = req.body.removeTestsFromSprint;
  const testsIdsToRemoveFromSprint = req.body.removeTestFromSprint;

  if (removeAction) {
    const sprintId = req.body.sprintId;

    if (testsIdsToRemoveFromSprint) {

      removeTestsFromSprint(sprintId, testsIdsToRemoveFromSprint);

      const allOtherTests = sprintHelper.getAllOtherTestsNotInSprint(parseInt(sprintId, 10));
      const sprint = sprintHelper.getSprintById(parseInt(sprintId, 10));

      renderer.sprint(res, sprint, getTestObjectsForSprintView(sprintId), allOtherTests);
    } else {
      // user has not selected any rows
      const allOtherTests = sprintHelper.getAllOtherTestsNotInSprint(parseInt(sprintId, 10));
      const sprint = sprintHelper.getSprintById(parseInt(sprintId, 10));
      renderer.sprint(res, sprint, getTestObjectsForSprintView(sprintId), allOtherTests, 'You must select atleast one test to remove from sprint.');

    }

  }

});

export {router as sprintRoutes};
