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
const fsSecretJSON = dbHelper_1.default.getDataFile(dbHelper_1.MODEL.SECRET);
const fsMasterKeyJSON = dbHelper_1.default.getDataFile(dbHelper_1.MODEL.MASTERKEY);
const fs_1 = __importDefault(require("fs"));
const v1_1 = __importDefault(require("uuid/v1"));
class securityKeyHelper {
    static getMasterKey() {
        const master = JSON.parse(fs_1.default.readFileSync(fsMasterKeyJSON, 'utf-8'));
        if (!master) {
            throw new Error('Master key is empty. Please set one to continue.');
        }
        return master.key;
    }
    static isValidSecret(key) {
        const s = this.getSecrets();
        console.log(s);
        let found = false;
        for (const f of s) {
            console.log('Key is ', f);
            if (f === key) {
                found = true;
                break;
            }
        }
        return found;
    }
    static createSecret() {
        const secrets = this.getSecrets();
        const newSecret = v1_1.default();
        secrets.push(newSecret);
        fs_1.default.writeFileSync(fsSecretJSON, JSON.stringify(secrets));
        return newSecret;
    }
    static removeSecret(key) {
        const secrets = this.getSecrets();
        const newSecrets = secrets.filter((s) => s !== key);
        fs_1.default.writeFileSync(fsSecretJSON, JSON.stringify(newSecrets));
    }
    static getSecrets() {
        return JSON.parse(fs_1.default.readFileSync(fsSecretJSON, 'utf-8'));
    }
}
exports.default = securityKeyHelper;
//# sourceMappingURL=securityKeyHelper.js.map