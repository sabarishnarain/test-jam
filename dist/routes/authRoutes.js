"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.authRoutes = router;
const renderer_1 = __importDefault(require("../renderers/renderer"));
const userHelper_1 = __importDefault(require("../helpers/userHelper"));
const projectHelper_1 = __importDefault(require("../helpers/projectHelper"));
router.get('/login*', (req, res) => {
    if (req.query.logout) {
        console.log('logout');
        req.session.username = undefined;
    }
    renderer_1.default.login(res, undefined);
});
router.post('/login*', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        // edge cases
        renderer_1.default.login(res, 'You have not entered username or password.');
        return;
    }
    if (!userHelper_1.default.findUser(username)) {
        // Non-existent username
        renderer_1.default.login(res, 'Hmm.. Looks like the username does not exist. Register yourself from the link to the left.');
        return;
    }
    if (userHelper_1.default.verifyPassword(username, password)) {
        // Login success
        req.session.username = username;
        console.log('Session ', req.session.username);
        console.log('Local var ', res.locals.isAdmin);
        renderer_1.default.home(res, projectHelper_1.default.getAllProjects(), undefined, undefined, undefined, 'Happy collaboration!');
        return;
    }
    // Incorrect password
    renderer_1.default.login(res, 'Invalid credentials');
});
router.get('/register*', (req, res) => {
    renderer_1.default.register(res, undefined);
});
router.post('/register*', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const secretKey = req.body.secret;
    if (!username || !password) {
        renderer_1.default.register(res, 'Username or password cannot be empty');
        return;
    }
    if (!secretKey) {
        renderer_1.default.register(res, 'You must use a secret key to register. Contact the maintainer to get one.');
        return;
    }
    if (userHelper_1.default.findUser(username)) {
        renderer_1.default.register(res, `Hmm.. Looks like the username "${username}" already exists in the system.` +
            `If this is you, then contact the maintainer to investigate further.`);
        return;
    }
    try {
        userHelper_1.default.createUser(username, password, secretKey);
    }
    catch (err) {
        console.error(err);
        renderer_1.default.register(res, 'Ouch! It looks like you have used an invalid/expired key. Contact the maintainer to get new one.');
        return;
    }
    renderer_1.default.login(res, undefined, 'Registration successful. You can now login to continue.');
});
//# sourceMappingURL=authRoutes.js.map