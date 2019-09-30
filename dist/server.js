"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const body_parser_1 = __importDefault(require("body-parser"));
const node_sass_middleware_1 = __importDefault(require("node-sass-middleware"));
const path_1 = __importDefault(require("path"));
const projectRoutes_1 = require("./routes/projectRoutes");
const homeRoutes_1 = require("./routes/homeRoutes");
const dashboardRoutes_1 = require("./routes/dashboardRoutes");
const addTestRoutes_1 = require("./routes/addTestRoutes");
const e2eRoutes_1 = require("./routes/e2eRoutes");
const editTestRoutes_1 = require("./routes/editTestRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const clientSecretRoutes_1 = require("./routes/clientSecretRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const runTestRoutes_1 = require("./routes/runTestRoutes");
const express_session_1 = __importDefault(require("express-session"));
const ejs_1 = require("ejs");
const renderer_1 = __importDefault(require("./renderers/renderer"));
const port = (process.env.JDAM_ENV_PROD === 'true') ? 80 : 3000;
app.engine('html', ejs_1.renderFile);
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(node_sass_middleware_1.default({
    src: path_1.default.join(__dirname, '..', '/scss'),
    dest: path_1.default.join(__dirname, '..', '/css'),
}));
app.set('view engine', 'ejs');
app.use(express_1.default.static('./dist/client/css'));
app.use(express_1.default.static('./dist/client/js'));
app.use(express_1.default.static('./dist/client/images'));
app.use(express_session_1.default({
    secret: 'keyboard cat'
}));
app.use((req, res, next) => {
    console.log('Bip! ' + req.session.username);
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
app.get('*', (req, res, next) => {
    if (req.session.username || req.originalUrl.endsWith('register.html') || req.originalUrl.endsWith('about.html')) {
        next();
    }
    else {
        renderer_1.default.login(res, 'Whoops! Session expired. Login to continue');
    }
});
app.get('/about*', (req, res) => {
    renderer_1.default.aboutUs(res);
});
// use modular routes
app.use(projectRoutes_1.projectRoutes);
app.use(homeRoutes_1.homeRoute);
app.use(dashboardRoutes_1.dashboardRoutes);
app.use(addTestRoutes_1.addTestRoutes);
app.use(e2eRoutes_1.e2eRoutes);
app.use(editTestRoutes_1.editTestRoutes);
app.use(authRoutes_1.authRoutes);
app.use(clientSecretRoutes_1.clientSecretRoutes);
app.use(userRoutes_1.userRoutes);
app.use(runTestRoutes_1.runTestRoutes);
app.listen(port);
//# sourceMappingURL=server.js.map