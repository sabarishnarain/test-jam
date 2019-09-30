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
const fsUsersJSON = dbHelper_1.default.getDataFile(dbHelper_1.MODEL.USER);
const fs_1 = __importDefault(require("fs"));
const securityKeyHelper_1 = __importDefault(require("./securityKeyHelper"));
class userHelper {
    /**
     * Find user by id.
     * @param username
     * @returns user object | undefined
     */
    static findUserById(id) {
        return this.getAllUsers().filter((user) => {
            return user.id === id;
        })[0];
    }
    /**
     * Find user by username
     * @param username
     * @returns user object | undefined
     */
    static findUser(username) {
        return this.getAllUsers().filter((user) => {
            return user.username === username;
        })[0];
    }
    static createUser(username, password, secret) {
        if (!securityKeyHelper_1.default.isValidSecret(secret)) {
            throw Error('Invalid security key.');
        }
        const usersJson = this.getAllUsers();
        const recentId = util_1.default.getMaxId(this.getAllUsers());
        const adminFlag = (recentId === 0) ? 1 : 0; // first user is always admin
        usersJson.push({ id: recentId + 1, username, password, admin: adminFlag });
        this.saveContents(usersJson);
        securityKeyHelper_1.default.removeSecret(secret);
    }
    static getAllUsers() {
        return JSON.parse(fs_1.default.readFileSync(fsUsersJSON, 'utf-8'));
    }
    static verifyPassword(username, password) {
        const user = this.findUser(username);
        if (user && user.password === password) {
            return true;
        }
        return false;
    }
    static saveContents(contents) {
        fs_1.default.writeFileSync(fsUsersJSON, JSON.stringify(contents));
    }
}
exports.default = userHelper;
//# sourceMappingURL=userHelper.js.map