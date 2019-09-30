"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
class dbHelper {
    static getDataFile(model) {
        const baseDirPath = this._getBaseDirPath();
        let filePath;
        if (model === MODEL.USER) {
            filePath = path_1.default.join(baseDirPath, 'users.json');
        }
        else if (model === MODEL.PROJECT) {
            filePath = path_1.default.join(baseDirPath, 'projects.json');
        }
        else if (model === MODEL.TESTS) {
            filePath = path_1.default.join(baseDirPath, 'tests.json');
        }
        else if (model === MODEL.SECRET) {
            filePath = path_1.default.join(baseDirPath, 'secret.json');
        }
        else if (model === MODEL.MASTERKEY) {
            filePath = path_1.default.join(baseDirPath, 'master-key.json');
        }
        if (!fs_extra_1.default.existsSync(filePath)) {
            fs_extra_1.default.createFileSync(filePath);
            if (model === MODEL.MASTERKEY) {
                fs_extra_1.default.writeFileSync(filePath, JSON.stringify({ key: 'nobodyownsnothing' }));
            }
            else if (model === MODEL.USER) {
                fs_extra_1.default.writeFileSync(filePath, JSON.stringify([{ username: 'jdam', password: 'jdam' }]));
            }
            else {
                fs_extra_1.default.writeFileSync(filePath, '[]');
            }
        }
        return filePath;
    }
    static getDataFileForTestHistory(testId) {
        const baseDirPath = this._getBaseDirPath();
        return path_1.default.join(baseDirPath, 'history', 'test-' + testId + '.json');
    }
    static _getBaseDirPath() {
        const subDirPath = (process.env.JDAM_ENV_TEST === 'true') ? 'test' : 'prod';
        return path_1.default.join(__dirname, '..', '..', 'db', subDirPath);
    }
}
exports.default = dbHelper;
var MODEL;
(function (MODEL) {
    MODEL[MODEL["USER"] = 0] = "USER";
    MODEL[MODEL["PROJECT"] = 1] = "PROJECT";
    MODEL[MODEL["TESTS"] = 2] = "TESTS";
    MODEL[MODEL["SECRET"] = 3] = "SECRET";
    MODEL[MODEL["MASTERKEY"] = 4] = "MASTERKEY";
})(MODEL = exports.MODEL || (exports.MODEL = {}));
//# sourceMappingURL=dbHelper.js.map