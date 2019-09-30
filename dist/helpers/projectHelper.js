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
const fsProjectsJSON = dbHelper_1.default.getDataFile(dbHelper_1.MODEL.PROJECT);
const fs_1 = __importDefault(require("fs"));
class testHelper {
    static getAllProjects() {
        return JSON.parse(fs_1.default.readFileSync(fsProjectsJSON, 'utf-8'));
    }
    static getProject(pid) {
        console.log('Get project with id ', pid);
        return this.getAllProjects().filter((p) => p.id === pid)[0];
    }
    static saveProjects(contents) {
        fs_1.default.writeFileSync(fsProjectsJSON, JSON.stringify(contents));
    }
    /**
     * Generate project id.
     * 1. if name is single word, then first 3 chars + random 4 digit number
     * 2. if name is two or more words, then first letter of each word + random 4 digit number
     */
    static generateProjectCode(name) {
        let code = '';
        if (name.split(' ').length > 1) {
            const arr = name.split(' ');
            for (const a of arr) {
                code = code + a.substr(0, 2);
            }
        }
        else {
            code = name.substr(0, 3);
        }
        return code + Date.now() % 10000;
    }
}
exports.default = testHelper;
//# sourceMappingURL=projectHelper.js.map