import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import projectHelper from '../helpers/projectHelper';
import renderer from '../renderers/renderer';
import viewHelper from '../helpers/viewHelper';

router.get('/editTest.html', (req: any, res: any) => {
  console.log(req.query);
  const testId = req.query.testId;
  console.log('Show test with id ', testId);
  const currTest = testHelper.getTestById(testId);
  const projectNameOfTest = (currTest) ? projectHelper.getProject(currTest.project).name : '';

  const otherTestsInProject  = testHelper.getTestsForProject(currTest.project);

  const history = testHelper.getHistoryForTest(testId);
  renderer.editTest(res, currTest, projectNameOfTest, history, otherTestsInProject);

});

router.post('/editTest*', (req: any, res: any) => {
  console.log(req.body);
  const testId = req.body.testId;

  if (req.body.cancelEdit) {
    const data = viewHelper.getDataForHomeView(undefined , undefined);

    renderer.home(res, data.sprints, data.sprintFilter, data.projects,
      data.projectFilter, data.results);
    return;
  }

  if (req.body.copyTo) {
    renderer.addNewTest(res, projectHelper.getAllProjects(), undefined, undefined, undefined,
      req.body.title, req.body.desc, req.body.identifier);
    return;
  }

  if (req.body.action === 'delete') {
    testHelper.removeTests([req.body.testId]);
    renderer.home(res, projectHelper.getAllProjects(), undefined, undefined, undefined, 'Test successfully removed.');
    return;
  }

  if (req.body.action === 'run') {
    res.redirect('/runTest?testId=' + testId);
    return;
  }

  if (req.body.action === 'save') {

    console.log('update test with id', testId);

    let currTest = testHelper.getTestById(testId);
    const projectNameOfTest = (currTest) ? projectHelper.getProject(currTest.project).name : '';

    // let projectsList = testHelper.getProjectsForTest(req.body.testProject);
    const otherTestsInProject  = testHelper.getTestsForProject(currTest.project);

    if (req.body.title.trim().length === 0) {
      renderer.editTest(res, currTest, projectNameOfTest, testHelper.getHistoryForTest(testId), otherTestsInProject, 'Scenario name cannot be empty.');
      return;
    }
    if (req.body.desc.trim().length === 0) {
      renderer.editTest(res, currTest, projectNameOfTest, testHelper.getHistoryForTest(testId), otherTestsInProject, 'Scenario description cannot be empty.');
      return;
    }

    if (req.body.title.length > 200 ) {
      renderer.editTest(res, { id: testId, title : req.body.title, desc : req.body.desc, identifier : req.body.identifier},
        projectNameOfTest, testHelper.getHistoryForTest(testId), otherTestsInProject, 'Name cannot be more than 200 chars.');
      return;
    }

    if (req.body.desc.length > 1300 ) {
      renderer.editTest(res, { id: testId, title : req.body.title, desc : req.body.desc, identifier : req.body.identifier},
        projectNameOfTest, testHelper.getHistoryForTest(testId),
                        otherTestsInProject, 'Description is too long. Please enter shorter description or consider splitting tests.');
      return;
    }

    // update the test contents only
    testHelper.updateTestById(parseInt(req.body.testId, 10), req.body.title, req.body.desc, req.body.identifier);

    // refresh the test objects and projects references after update success.
    currTest = testHelper.getTestById(testId);

    renderer.editTest(res, testHelper.getTestById(testId), projectNameOfTest,
                      testHelper.getHistoryForTest(testId), otherTestsInProject, undefined, 'Test successfully updated');

  }

});

export {router as editTestRoutes};
