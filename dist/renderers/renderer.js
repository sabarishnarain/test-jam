"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const clientBasePath = path_1.default.resolve(__dirname, '..', 'views');
class renderers {
    /**
     * Routes /projects.html
     * @param res
     * @param projectsWithTests - projects
     * @param error
     */
    static projects(res, projectsWithTests, error, success) {
        res.render(clientBasePath + '/projects', { projectsWithTests, error, success });
    }
    /**
     * Routes /project.html
     * @param res
     * @param tests - tests in particular project
     * @param project
     * @param error
     */
    static project(res, tests, project, error, success) {
        res.render(clientBasePath + '/project', { tests, project, error, success });
    }
    static createProject(res, error, success) {
        res.render(clientBasePath + '/createProject', { error, success });
    }
    static addNewTest(res, projects, filter, error, success, title, desc, identifier) {
        res.render(clientBasePath + '/addNewTest', { projects, filter, error, success, title, desc, identifier });
    }
    static runTest(res, test, statuses, error, success) {
        res.render(clientBasePath + '/runTest', { test, statuses, error, success });
    }
    static home(res, projects, tests, filter, error, success) {
        res.render(clientBasePath + '/home', { projects, tests, filter, error, success });
    }
    static dashboard(res, results) {
        res.render(clientBasePath + '/dashboard', { results });
    }
    static completion(res, results) {
        res.render(clientBasePath + '/completion', { results });
    }
    static editTest(res, currentTest, projectsList, history, otherTestsInProject, error, success) {
        res.render(clientBasePath + '/editTest', { currentTest, projectsList, history, otherTestsInProject, error, success });
    }
    static testHistory(res, projectName, history, error, success) {
        res.render(clientBasePath + '/testHistory', { projectName, history, error, success });
    }
    static register(res, error, success) {
        res.render(clientBasePath + '/register', { error, success });
    }
    static login(res, error, success) {
        res.render(clientBasePath + '/login', { error, success });
    }
    static users(res, username, users, error, success) {
        res.render(clientBasePath + '/users', { username, users, error, success });
    }
    static user(res, username, user, error, success) {
        res.render(clientBasePath + '/user', { username, user, error, success });
    }
    static error(res, username, error) {
        res.render(clientBasePath + '/error', { username, error });
    }
    static aboutUs(res) {
        res.render(clientBasePath + '/about');
    }
}
exports.default = renderers;
//# sourceMappingURL=renderer.js.map