"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbHelper_1 = __importStar(require("./dbHelper"));
const util_1 = __importDefault(require("../utils/util"));
const fsTestsJSON = dbHelper_1.default.getDataFile(dbHelper_1.MODEL.TESTS);
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const projectHelper_1 = __importDefault(require("./projectHelper"));
class testHelper {
    static getAllTests(optimized = false) {
        const tests = JSON.parse(fs_1.default.readFileSync(fsTestsJSON, 'utf-8'));
        if (optimized) {
            for (const t of tests) {
                if (t.title.length >= 200) {
                    t.title = t.title.substring(0, 200) + '...';
                }
                if (t.desc.length >= 200) {
                    t.desc = t.desc.substring(0, 200) + '...';
                }
            }
        }
        return tests;
    }
    static getTestById(id) {
        const test = this.getAllTests().filter((t) => {
            return t.id === parseInt(id, 10);
        });
        return test[0];
    }
    static getTestsForProject(projectId) {
        const tests = this.getAllTests(true);
        return tests.filter((t) => {
            return t.project === projectId;
        });
    }
    static addTest(title, desc, identifier, projectId) {
        const contents = this.getAllTests();
        const recentId = testHelper.getRecentId();
        contents.push({ id: recentId + 1,
            title,
            desc,
            status: '',
            identifier,
            build: '',
            project: projectId });
        this.saveTests(contents);
        return recentId + 1;
    }
    static updateTestById(id, status, title, desc, identifier, build, projectId, lastUpdated) {
        const tests = testHelper.getAllTests();
        let isTestFound = false;
        status = this.lookupStatus(status);
        for (const t of tests) {
            if (t.id === parseInt(id, 10)) {
                console.log('update test');
                isTestFound = true;
                t.status = status;
                if (title) {
                    t.title = title;
                }
                if (desc) {
                    t.desc = desc;
                }
                if (identifier) {
                    t.identifier = identifier;
                }
                if (projectId) {
                    t.project = projectId;
                }
                if (build) {
                    t.build = build;
                }
                if (lastUpdated) {
                    t.lastUpdated = lastUpdated;
                }
            }
        }
        if (isTestFound) {
            testHelper.saveTests(tests);
        }
        return isTestFound;
    }
    /**
     * Creates a test run by id.
     * @param id
     * @param status
     * @param build
     */
    static runTestById(id, status, build) {
        const tests = testHelper.getAllTests();
        let isTestFound = false;
        status = this.lookupStatus(status);
        for (const t of tests) {
            if (t.id === parseInt(id, 10)) {
                console.log('update test');
                isTestFound = true;
            }
        }
        if (isTestFound) {
            const lastUpdated = new Date();
            testHelper.addHistory(id, status, build, lastUpdated);
            this.updateTestById(id, status, undefined, undefined, undefined, build, undefined, lastUpdated);
        }
        return isTestFound;
    }
    /**
     * Creates a  test run with identifier and project id.
     * @param identifier
     * @param projectId
     * @param status
     */
    static runTestByIndentifier(identifier, projectId, build, status) {
        const tests = testHelper.getAllTests();
        let isTestFound = false;
        let testId;
        status = this.lookupStatus(status);
        for (const t of tests) {
            if (t.identifier === identifier && t.project === projectId) {
                isTestFound = true;
                t.status = status;
                t.build = build;
                testId = t.id;
                break;
            }
        }
        if (isTestFound) {
            const lastUpdated = new Date();
            testHelper.saveTests(tests);
            testHelper.addHistory(testId, status, build, lastUpdated);
        }
        return isTestFound;
    }
    static removeTests(testIdsArr) {
        // Convert all test ids to integer array
        const idsToInteger = testIdsArr.map((id) => {
            return parseInt(id, 10);
        });
        const testsPostDelete = this.getAllTests().filter((t) => {
            return !idsToInteger.includes(t.id);
        });
        // remove history one by one
        for (const id of idsToInteger) {
            testHelper.removeHistory(id);
        }
        testHelper.saveTests(testsPostDelete);
    }
    /**
     * Get all projects along with the project id associated with the test,
     * and return array of string - where each item is
     * <projectid>#<projectname>#<isSelected>
     * @param projectId
     */
    static getProjectsForTest(projectId) {
        const projects = projectHelper_1.default.getAllProjects();
        const projectsList = [];
        for (const p of projects) {
            const isSelected = (p.id === projectId);
            projectsList.push(p.id + '#' + p.name + '#' + isSelected);
        }
        return projectsList;
    }
    /**
     * Get most recent id for project from data.json
     * @param tests
     */
    static getRecentId() {
        return util_1.default.getMaxId(this.getAllTests());
    }
    static getStatusesForTest(testId) {
        console.log('Get statuses for test: ', testId);
        const test = this.getTestById(testId);
        const statusList = [];
        statusList.push('NORUN#NORUN#' + (test.status === 'NORUN'));
        statusList.push('PASS#PASS#' + (test.status === 'PASS'));
        statusList.push('FAIL#FAIL#' + (test.status === 'FAIL'));
        return statusList;
    }
    static getStatuses() {
        console.log('Get statuses');
        const statusList = [];
        statusList.push('-#--Select--');
        statusList.push('pass#PASS');
        statusList.push('fail#FAIL');
        return statusList;
    }
    static addHistory(testId, status, build, date) {
        const id = parseInt(testId, 10);
        status = this.lookupStatus(status);
        const fsHistoryJSON = dbHelper_1.default.getDataFileForTestHistory(id);
        let contents;
        if (!fs_1.default.existsSync(fsHistoryJSON)) {
            console.log('File ' + fsHistoryJSON + '.json does not exist.');
            fs_extra_1.default.ensureFileSync(fsHistoryJSON);
            contents = [];
        }
        else {
            console.log('File test-' + id + '.json exist.');
            contents = JSON.parse(fs_1.default.readFileSync(fsHistoryJSON, 'utf-8'));
        }
        contents.push({ testId: parseInt(testId, 10), status, build, date });
        fs_1.default.writeFileSync(fsHistoryJSON, JSON.stringify(contents));
    }
    static getHistoryForTest(testId) {
        const fsHistoryJSON = dbHelper_1.default.getDataFileForTestHistory(testId);
        let historyContents;
        if (fs_1.default.existsSync(fsHistoryJSON)) {
            historyContents = JSON.parse(fs_1.default.readFileSync(fsHistoryJSON, 'utf-8')).reverse();
        }
        else {
            historyContents = [];
        }
        return historyContents;
    }
    static removeHistory(testId) {
        const fsHistoryJSON = dbHelper_1.default.getDataFileForTestHistory(testId);
        if (fs_1.default.existsSync(fsHistoryJSON)) {
            console.log('Remove history ' + testId);
            fs_1.default.unlinkSync(fsHistoryJSON);
        }
    }
    static searchTests(keyword) {
        return this.getAllTests().filter((t) => {
            return t.testname.includes(keyword) || t.scenario.includes(keyword);
        });
    }
    static isValidStatus(status) {
        const statuses = ['PASS', 'FAIL', 'NORUN', 'DEPRECATED', 'PASSED', 'FAILED'];
        return statuses.includes(status.toUpperCase());
    }
    /**
     * Returns a valid status name by removing tailing 'ED'.
     * Frameworks such as junit use statuses as PASSED or FAILED that needs to be trimmed a bit.
     * @param status
     */
    static lookupStatus(status) {
        if (status) {
            status = status.toUpperCase();
            if (status === 'PASSED') {
                status = 'PASS';
            }
            else if (status === 'FAILED') {
                status = 'FAIL';
            }
            return status;
        }
        return '';
    }
    static saveTests(contents) {
        fs_1.default.writeFileSync(fsTestsJSON, JSON.stringify(contents));
    }
}
exports.default = testHelper;
//# sourceMappingURL=testHelper.js.map