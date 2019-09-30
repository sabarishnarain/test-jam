"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.addTestRoutes = router;
const testHelper_1 = __importDefault(require("../helpers/testHelper"));
const projectHelper_1 = __importDefault(require("../helpers/projectHelper"));
const renderer_1 = __importDefault(require("../renderers/renderer"));
// -----------------------------------------------------------------------------------------------------------
router.get('/addNewTest*', (req, res) => {
    renderer_1.default.addNewTest(res, projectHelper_1.default.getAllProjects(), undefined);
});
// ---------------------------------------------------------------------------------------------------------
router.post('/addNewTest*', (req, res) => {
    if (!req.body.createTest) {
        console.log('Go home');
        renderer_1.default.home(res, projectHelper_1.default.getAllProjects(), undefined, undefined);
        return;
    }
    if (req.body.createTest) {
        const testTitle = req.body.title;
        const testDescription = req.body.description;
        const testIdentifier = req.body.identifier;
        console.log('Title length ', testTitle.length);
        console.log('Description length', testDescription.length);
        if (testTitle.length > 200) {
            renderer_1.default.addNewTest(res, projectHelper_1.default.getAllProjects(), req.body.project, 'Name cannot be more than 200 chars.', undefined, testTitle, testDescription, testIdentifier);
            return;
        }
        if (testDescription.length > 1300) {
            renderer_1.default.addNewTest(res, projectHelper_1.default.getAllProjects(), req.body.project, 'Description is too long. Please enter shorter description or consider splitting tests.', undefined, testTitle, testDescription, testIdentifier);
            return;
        }
        if (testTitle.trim().length === 0 || testDescription.trim().length === 0) {
            renderer_1.default.addNewTest(res, projectHelper_1.default.getAllProjects(), req.body.project, 'Name or description cannot be empty');
            return;
        }
        const testId = testHelper_1.default.addTest(testTitle, testDescription, testIdentifier, req.body.project);
        renderer_1.default.addNewTest(res, projectHelper_1.default.getAllProjects(), req.body.project, undefined, `Test with id ${testId} successfully added`);
    }
});
//# sourceMappingURL=addTestRoutes.js.map