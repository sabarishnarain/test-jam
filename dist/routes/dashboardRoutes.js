"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.dashboardRoutes = router;
const testHelper_1 = __importDefault(require("../helpers/testHelper"));
const projectHelper_1 = __importDefault(require("../helpers/projectHelper"));
const renderer_1 = __importDefault(require("../renderers/renderer"));
const dashboardHelper_1 = __importDefault(require("../helpers/dashboardHelper"));
router.get('/dashboard*', (req, res) => {
    console.log('Query is for home ', req.query);
    console.log('Params is for home ', req.params);
    const result = dashboardHelper_1.default.getData();
    renderer_1.default.dashboard(res, result);
});
router.post('/dashboard*', (req, res) => {
    console.log('Query is for home ', req.query);
    console.log('Params is for home ', req.params);
    console.log('Body is ', req.body);
    const projectId = req.body.projectId;
    const filteredTests = testHelper_1.default.getTestsForProject(projectId);
    renderer_1.default.home(res, projectHelper_1.default.getAllProjects(), filteredTests, projectId);
});
router.get('/completion*', (req, res) => {
    const result = dashboardHelper_1.default.getData();
    renderer_1.default.completion(res, result);
});
//# sourceMappingURL=dashboardRoutes.js.map