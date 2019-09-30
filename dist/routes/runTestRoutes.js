"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.runTestRoutes = router;
const testHelper_1 = __importDefault(require("../helpers/testHelper"));
const renderer_1 = __importDefault(require("../renderers/renderer"));
router.get('/runTest', (req, res) => {
    const testId = req.query.testId;
    console.log('Test id from GET runtest ', testId);
    const test = testHelper_1.default.getTestById(testId);
    renderer_1.default.runTest(res, test, testHelper_1.default.getStatuses());
});
router.post('/runTest', (req, res) => {
    console.log(req.body);
    const testId = req.body.testId;
    let currTest = testHelper_1.default.getTestById(testId);
    const projectsList = testHelper_1.default.getProjectsForTest(req.body.testProject);
    const otherTestsInProject = testHelper_1.default.getTestsForProject(currTest.project);
    if (req.body.cancelRun) {
        renderer_1.default.editTest(res, currTest, projectsList, testHelper_1.default.getHistoryForTest(testId), otherTestsInProject, undefined, 'Test run cancelled.');
        return;
    }
    if (req.body.runTest) {
        const status = req.body.status;
        const build = req.body.build;
        if (status && status === '-') {
            renderer_1.default.runTest(res, currTest, testHelper_1.default.getStatuses(), 'Please select a valid status');
            return;
        }
        console.log('Build is ', build);
        console.log('Build is ', build.trim().length);
        if (build.trim().length === 0) {
            renderer_1.default.runTest(res, currTest, testHelper_1.default.getStatuses(), 'Please enter a valid build');
            return;
        }
        testHelper_1.default.runTestById(testId, status, build);
        currTest = testHelper_1.default.getTestById(testId);
        renderer_1.default.editTest(res, currTest, projectsList, testHelper_1.default.getHistoryForTest(testId), otherTestsInProject, undefined, 'Test successfully executed.');
        return;
    }
});
//# sourceMappingURL=runTestRoutes.js.map