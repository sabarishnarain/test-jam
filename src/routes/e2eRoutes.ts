import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';

router.post('/tests/:id/update', (req: any, res: any) => {

    console.log('Update test status:', req.body);
    const testId = req.params.id;
    const status = req.body.status;
    const build = req.body.build;
    const sprintId = req.body.sprintId;

    if ( !status || !build) {
      res.status(400).send('Status or build properties not found in payload.');
      return;
    }

    if (!testHelper.isValidStatus(status)) {
      res.status(400).send('Invalid test status. Valid statuses are PASS(ED), FAIL(ED), NORUN, DEPRECATED');
      return;
    }

    console.log('Update test status with id', testId);
    const test = testHelper.getTestById(testId);
    if (test) {
      testHelper.runTestById(testId, status, build, sprintId, req.session.username);
      res.status(200).send('Test with id successfully updated.');
    } else {
      res.status(500).send('Test not found with Id ' + testId);
    }

  });

router.post('/projects/:id/tests/:name/update', (req: any, res: any) => {
    console.log('Update test status with name : ', req.body);
    const identifier = req.params.name;
    const projectId = req.params.id;
    const testStatus = req.body.status;
    const build = req.body.build;
    const sprintId = req.body.sprintId;

    if ( !testStatus || !build) {
      res.status(400).send('Insufficient parameters. Status or build not found in payload');
      return;
    }

    if (!testHelper.isValidStatus(testStatus)) {
      res.status(400).send('Invalid test status. Valid statuses are PASS(ED), FAIL(ED), NORUN, DEPRECATED');
      return;
    }
    const found: boolean = testHelper.runTestByIndentifier(identifier, projectId, build, testStatus, sprintId, req.session.username);

    if (found) {
      res.status(200).send('Test updated successfully with name');
    } else {
      res.status(500).send('Test not found with name');
    }

  });

export {router as e2eRoutes};
