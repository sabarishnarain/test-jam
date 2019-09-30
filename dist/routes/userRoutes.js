"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.userRoutes = router;
const renderer_1 = __importDefault(require("../renderers/renderer"));
const userHelper_1 = __importDefault(require("../helpers/userHelper"));
router.get('/user.*', (req, res) => {
    const user = userHelper_1.default.findUser(req.session.username);
    if (user.admin !== 1) {
        renderer_1.default.error(res, req.session.username);
        return;
    }
    if (req.query.userid) {
        const id = parseInt(req.query.userid, 10);
        console.log('Edit user with id', id);
        renderer_1.default.user(res, req.session.username, userHelper_1.default.findUserById(id));
        return;
    }
});
router.post('/user', (req, res) => {
    if (req.body.cancel) {
        renderer_1.default.users(res, req.session.username, userHelper_1.default.getAllUsers());
        return;
    }
    if (req.body.save) {
        const id = parseInt(req.body.userid, 10);
        const role = req.body.role;
        const adminValue = role === 'admin' ? 1 : 0;
        console.log('Update user with id', id);
        console.log(userHelper_1.default.findUserById(id));
        const users = userHelper_1.default.getAllUsers();
        for (const u of users) {
            if (u.id === id) {
                u.admin = adminValue;
            }
        }
        userHelper_1.default.saveContents(users);
        renderer_1.default.user(res, req.session.username, userHelper_1.default.findUserById(id), undefined, 'User updated successfully');
        return;
    }
});
//
router.get('/users*', (req, res) => {
    const user = userHelper_1.default.findUser(req.session.username);
    if (user.admin === 1) {
        renderer_1.default.users(res, req.session.username, userHelper_1.default.getAllUsers());
    }
    else {
        renderer_1.default.error(res, req.session.username);
    }
});
router.post('/users', (req, res) => {
    const users = userHelper_1.default.getAllUsers();
    const usernameToDelete = req.body.deleteUser;
    console.log('Delete user(s) with id: ', usernameToDelete);
    if (req.body.deleteUser) {
        if (usernameToDelete) {
            if (usernameToDelete === req.session.username) {
                renderer_1.default.users(res, req.session.username, 'Error occured while deleting user.');
                return;
            }
            let usersPostDelete;
            if (Array.isArray(usernameToDelete)) {
                console.log('Multi delete.', usernameToDelete);
                // when ids are more than 1, it is sent as string array.
                usersPostDelete = users.filter((t) => {
                    return !usernameToDelete.includes(t.id);
                });
            }
            else {
                console.log('Single user delete.', usernameToDelete);
                usersPostDelete = users.filter((u) => {
                    return usernameToDelete !== u.username;
                });
            }
            userHelper_1.default.saveContents(usersPostDelete);
            renderer_1.default.users(res, req.session.username, userHelper_1.default.getAllUsers(), undefined, 'User successfully removed');
        }
        else {
            renderer_1.default.users(res, req.session.username, userHelper_1.default.getAllUsers(), 'You must select a user to delete.');
        }
    }
});
//# sourceMappingURL=userRoutes.js.map