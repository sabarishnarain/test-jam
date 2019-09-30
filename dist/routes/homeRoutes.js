"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.homeRoute = router;
const testHelper_1 = __importDefault(require("../helpers/testHelper"));
const projectHelper_1 = __importDefault(require("../helpers/projectHelper"));
const renderer_1 = __importDefault(require("../renderers/renderer"));
router.get('/', (req, res) => {
    res.redirect('/home');
});
router.get('/home*', (req, res) => {
    console.log('Home:');
    const projects = projectHelper_1.default.getAllProjects();
    const filter = req.query.projectFilter;
    const project = projectHelper_1.default.getProject(filter);
    const filteredTests = testHelper_1.default.getTestsForProject(filter);
    if (req.query.actions) {
        const actions = req.query.actions;
        if (actions === 'addTest') {
            renderer_1.default.addNewTest(res, projects, filter);
            return;
        }
        else if (actions === 'deleteTest') {
            renderer_1.default.project(res, filteredTests, project);
            return;
        }
    }
    if (req.query.projectFilter) {
        console.log('Project filter ', filter);
        renderer_1.default.home(res, projects, filteredTests, filter);
    }
    else {
        renderer_1.default.home(res, projects, undefined, filter);
    }
});
//# sourceMappingURL=homeRoutes.js.map