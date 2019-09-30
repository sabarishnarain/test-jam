"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.e2eRoutes = router;
const testHelper_1 = __importDefault(require("../helpers/testHelper"));
router.post('/tests/:id/update', (req, res) => {
    console.log('Update test status:', req.body);
    const testId = req.params.id;
    const status = req.body.status;
    const build = req.body.build;
    if (!status || !build) {
        res.status(400).send('Status or build properties not found in payload.');
        return;
    }
    if (!testHelper_1.default.isValidStatus(status)) {
        res.status(400).send('Invalid test status. Valid statuses are PASS(ED), FAIL(ED), NORUN, DEPRECATED');
        return;
    }
    console.log('Update test status with id', testId);
    const lastUpdated = new Date();
    const found = testHelper_1.default.updateTestById(testId, status, undefined, undefined, undefined, build, undefined, lastUpdated);
    if (found) {
        testHelper_1.default.addHistory(testId, status, build, lastUpdated);
        res.status(200).send('Test with id successfully updated.');
    }
    else {
        res.status(500).send('Test not found with Id ' + testId);
    }
});
router.post('/projects/:id/tests/:name/update', (req, res) => {
    console.log('Update test status with name : ', req.body);
    const identifier = req.params.name;
    const projectId = req.params.id;
    const testStatus = req.body.status;
    const build = req.body.build;
    if (!testStatus || !build) {
        res.status(400).send('Insufficient parameters. Status or build not found in payload');
        return;
    }
    if (!testHelper_1.default.isValidStatus(testStatus)) {
        res.status(400).send('Invalid test status. Valid statuses are PASS(ED), FAIL(ED), NORUN, DEPRECATED');
        return;
    }
    const found = testHelper_1.default.runTestByIndentifier(identifier, projectId, build, testStatus);
    if (found) {
        res.status(200).send('Test updated successfully with name');
    }
    else {
        res.status(500).send('Test not found with name');
    }
});
//# sourceMappingURL=e2eRoutes.js.map