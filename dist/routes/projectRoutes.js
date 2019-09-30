"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.projectRoutes = router;
const testHelper_1 = __importDefault(require("../helpers/testHelper"));
const projectHelper_1 = __importDefault(require("../helpers/projectHelper"));
const renderer_1 = __importDefault(require("../renderers/renderer"));
router.get('/projects.html', (req, res) => {
    // Find number of tests in each project
    const projectsWithTests = [];
    const projects = projectHelper_1.default.getAllProjects();
    for (const p of projects) {
        const tests = testHelper_1.default.getTestsForProject(p.id);
        projectsWithTests.push({ projectId: p.id, pName: p.name, testCount: tests.length });
    }
    renderer_1.default.projects(res, projectsWithTests);
});
//
router.get('/project.*', (req, res) => {
    const projectId = req.query.projectId;
    const project = projectHelper_1.default.getProject(projectId);
    renderer_1.default.project(res, testHelper_1.default.getTestsForProject(projectId), project);
});
router.post('/project', (req, res) => {
    const idToDel = req.body.deleteTestId;
    const projectId = req.body.projectId;
    const project = projectHelper_1.default.getProject(projectId);
    console.log('Delete test(s) with id: ', idToDel);
    if (idToDel) {
        let testIds = [];
        if (Array.isArray(idToDel)) {
            console.log('Multi test delete.', idToDel);
            testIds = idToDel;
        }
        else {
            testIds.push(idToDel);
        }
        testHelper_1.default.removeTests(testIds);
        renderer_1.default.project(res, testHelper_1.default.getTestsForProject(projectId), project, undefined, 'Test(s) deleted successfully.');
    }
    else if (req.body.deleteProject) {
        console.log('Delete project with id ', projectId);
        let projectsLst = projectHelper_1.default.getAllProjects();
        const projectsPostDelete = projectsLst.filter((p) => {
            return p.id !== projectId;
        });
        projectHelper_1.default.saveProjects(projectsPostDelete);
        projectsLst = projectHelper_1.default.getAllProjects();
        const projectsWithTests = [];
        for (const p of projectsLst) {
            const testsForProject = testHelper_1.default.getTestsForProject(p.id);
            projectsWithTests.push({ projectId: p.id, pName: p.name, testCount: testsForProject.length });
        }
        renderer_1.default.projects(res, projectsWithTests);
    }
    else {
        renderer_1.default.project(res, testHelper_1.default.getTestsForProject(projectId), project, 'You must select atleast one test to delete');
    }
});
router.post('/createProject', (req, res) => {
    let projects = projectHelper_1.default.getAllProjects();
    const inputName = req.body.pname;
    let errrorMsg = '';
    if (inputName.trim().length === 0) {
        errrorMsg = 'Project name cannot be empty';
    }
    for (const p of projects) {
        if (p.name === inputName) {
            errrorMsg = 'Project already exists';
            break;
        }
    }
    projects = projectHelper_1.default.getAllProjects();
    if (errrorMsg.length > 0) {
        const projectsWithTests = [];
        projects = projectHelper_1.default.getAllProjects();
        for (const p of projects) {
            const tests = testHelper_1.default.getTestsForProject(p.id);
            projectsWithTests.push({ projectId: p.id, pName: p.name, testCount: tests.length });
        }
        renderer_1.default.projects(res, projectsWithTests, errrorMsg);
    }
    else {
        const projectCode = projectHelper_1.default.generateProjectCode(inputName);
        projects.push({ id: projectCode, name: inputName });
        projectHelper_1.default.saveProjects(projects);
        const projectsWithTests = [];
        projects = projectHelper_1.default.getAllProjects();
        for (const p of projects) {
            const tests = testHelper_1.default.getTestsForProject(p.id);
            projectsWithTests.push({ projectId: p.id, pName: p.name, testCount: tests.length });
        }
        renderer_1.default.projects(res, projectsWithTests, undefined, `Project with name ${inputName} successfully created.
    You can now add tests to it.`);
    }
});
router.post('/deleteProject', (req, res) => {
    let projectsLst = projectHelper_1.default.getAllProjects();
    const projectId = req.body.deleteProject;
    console.log('Delete project with id ', projectId);
    if (testHelper_1.default.getTestsForProject(projectId).length > 0) {
        console.log('Cannot delete project with tests');
        renderer_1.default.projects(res, projectsLst, 'Cannot delete project when it contains tests.');
    }
    else {
        console.log('perform delete project');
        const projectsPostDelete = projectsLst.filter((p) => {
            return p.id !== projectId;
        });
        projectHelper_1.default.saveProjects(projectsPostDelete);
        projectsLst = projectHelper_1.default.getAllProjects();
        renderer_1.default.projects(res, projectsLst, undefined);
    }
});
//# sourceMappingURL=projectRoutes.js.map