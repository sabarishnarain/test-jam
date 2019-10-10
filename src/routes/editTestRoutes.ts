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
  const project = projectHelper.getProject(currTest.project);

  const otherTestsInProject  = testHelper.getTestsForProject(currTest.project);

  const history = testHelper.getHistoryForTest(testId);
  renderer.editTest(res, currTest, project, history, otherTestsInProject);

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
    testHelper.removeTests([testId]);
    const data = viewHelper.getDataForHomeView(undefined , undefined);

    renderer.home(res, data.sprints, data.sprintFilter, data.projects,
      data.projectFilter, data.results, undefined, 'Test successfully deleted.');
    return;
  }

  if (req.body.action === 'run') {
    res.redirect('/runTest?testId=' + testId);
    return;
  }

  if (req.body.action === 'save') {

    console.log('update test with id', testId);

    let intTestID;
    let currTest = testHelper.getTestById(testId);

    const otherTestsInProject  = testHelper.getTestsForProject(currTest.project);
    const history = testHelper.getHistoryForTest(testId);

    try {
      intTestID = parseInt(req.body.testId, 10);
    } catch (err) {
      renderer.error(res, req.session.username, 'Error updating test. Try again.');
      return;

    }

    const project = projectHelper.getProject(req.body.projectId);
    const jRes = testHelper.updateTestContents(intTestID, req.body.title, req.body.desc,
      req.body.identifier, req.body.projectId);

    if (jRes.err) {
      renderer.editTest(res, { id: testId, title : req.body.title, desc : req.body.desc, identifier : req.body.identifier},
        project, history, otherTestsInProject,  jRes.err);

    } else {
      currTest = testHelper.getTestById(testId);

      renderer.editTest(res, testHelper.getTestById(testId), project,
                      history, otherTestsInProject, undefined, 'Test successfully updated');

    }

  }

});

export {router as editTestRoutes};
