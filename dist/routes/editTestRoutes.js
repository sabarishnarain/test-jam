"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.editTestRoutes = router;
const testHelper_1 = __importDefault(require("../helpers/testHelper"));
const projectHelper_1 = __importDefault(require("../helpers/projectHelper"));
const renderer_1 = __importDefault(require("../renderers/renderer"));
router.get('/editTest.html', (req, res) => {
    console.log(req.query);
    const testId = req.query.testId;
    console.log('Show test with id ', testId);
    const currTest = testHelper_1.default.getTestById(testId);
    const projectsList = testHelper_1.default.getProjectsForTest(currTest.project);
    const otherTestsInProject = testHelper_1.default.getTestsForProject(currTest.project);
    const history = testHelper_1.default.getHistoryForTest(testId);
    renderer_1.default.editTest(res, currTest, projectsList, history, otherTestsInProject);
});
router.post('/editTest*', (req, res) => {
    console.log(req.body);
    const testId = req.body.testId;
    if (req.body.cancelEdit) {
        renderer_1.default.home(res, projectHelper_1.default.getAllProjects(), undefined, undefined);
        return;
    }
    if (req.body.copyTo) {
        renderer_1.default.addNewTest(res, projectHelper_1.default.getAllProjects(), undefined, undefined, undefined, req.body.title, req.body.desc, req.body.identifier);
        return;
    }
    if (req.body.action === 'delete') {
        testHelper_1.default.removeTests([req.body.testId]);
        renderer_1.default.home(res, projectHelper_1.default.getAllProjects(), undefined, undefined, undefined, 'Test successfully removed.');
        return;
    }
    if (req.body.action === 'run') {
        res.redirect('/runTest?testId=' + testId);
        return;
    }
    if (req.body.action === 'save') {
        console.log('update test with id', testId);
        let currTest = testHelper_1.default.getTestById(testId);
        let projectsList = testHelper_1.default.getProjectsForTest(req.body.testProject);
        const otherTestsInProject = testHelper_1.default.getTestsForProject(currTest.project);
        if (req.body.title.trim().length === 0) {
            renderer_1.default.editTest(res, currTest, projectsList, testHelper_1.default.getHistoryForTest(testId), otherTestsInProject, 'Scenario name cannot be empty.');
            return;
        }
        if (req.body.desc.trim().length === 0) {
            renderer_1.default.editTest(res, currTest, projectsList, testHelper_1.default.getHistoryForTest(testId), otherTestsInProject, 'Scenario description cannot be empty.');
            return;
        }
        if (req.body.title.length > 200) {
            renderer_1.default.editTest(res, { id: testId, title: req.body.title, desc: req.body.desc, identifier: req.body.identifier }, projectsList, testHelper_1.default.getHistoryForTest(testId), otherTestsInProject, 'Name cannot be more than 200 chars.');
            return;
        }
        if (req.body.desc.length > 1300) {
            renderer_1.default.editTest(res, { id: testId, title: req.body.title, desc: req.body.desc, identifier: req.body.identifier }, projectsList, testHelper_1.default.getHistoryForTest(testId), otherTestsInProject, 'Description is too long. Please enter shorter description or consider splitting tests.');
            return;
        }
        // update the test contents only
        testHelper_1.default.updateTestById(req.body.testId, undefined, req.body.title, req.body.desc, req.body.identifier, undefined, undefined, undefined);
        // refresh the test objects and projects references after update success.
        currTest = testHelper_1.default.getTestById(testId);
        projectsList = testHelper_1.default.getProjectsForTest(req.body.testProject);
        renderer_1.default.editTest(res, testHelper_1.default.getTestById(testId), testHelper_1.default.getProjectsForTest(req.body.testProject), testHelper_1.default.getHistoryForTest(testId), otherTestsInProject, undefined, 'Test successfully updated');
    }
});
//# sourceMappingURL=editTestRoutes.js.map