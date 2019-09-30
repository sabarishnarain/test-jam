"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testHelper_1 = __importDefault(require("./testHelper"));
const projectHelper_1 = __importDefault(require("./projectHelper"));
class dashboardHelper {
    static getData() {
        const projects = projectHelper_1.default.getAllProjects();
        const result = [];
        const projectsToTestMap = new Map();
        for (const p of projects) {
            const tests = testHelper_1.default.getTestsForProject(p.id);
            projectsToTestMap.set(p.id, tests);
        }
        for (const [key, value] of projectsToTestMap) {
            let passCount = 0;
            let failCount = 0;
            const tests = value;
            for (const t of tests) {
                if (t.status === 'PASS') {
                    passCount++;
                }
                else if (t.status === 'FAIL') {
                    failCount++;
                }
            }
            const project = projectHelper_1.default.getProject(key);
            result.push({ project, pass: passCount, fail: failCount, norun: tests.length - (passCount + failCount) });
        }
        return result;
    }
}
exports.default = dashboardHelper;
//# sourceMappingURL=dashboardHelper.js.map