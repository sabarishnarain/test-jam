"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.clientSecretRoutes = router;
const securityKeyHelper_1 = __importDefault(require("../helpers/securityKeyHelper"));
router.post('/auth/generate', (req, res) => {
    console.log('create client secret: ', req.body);
    const master = req.body.master;
    if (!master) {
        res.status(400).send('Master key not set in payload.');
        return;
    }
    if (securityKeyHelper_1.default.getMasterKey() !== master) {
        res.status(500).send('Invalid master key. Buzz your admin to verify this.');
        return;
    }
    const secret = securityKeyHelper_1.default.createSecret();
    res.status(200).send('Client secret generated successfully : ' + secret);
});
router.post('/auth/keys', (req, res) => {
    console.log('create client secret: ', req.body);
    const master = req.body.master;
    if (!master) {
        res.status(400).send('Master key not set in payload.');
        return;
    }
    if (securityKeyHelper_1.default.getMasterKey() !== master) {
        res.status(500).send('Invalid master key. Buzz your admin to verify this.');
        return;
    }
    const secrets = securityKeyHelper_1.default.getSecrets();
    res.status(200).send('Secrets : ' + secrets);
});
//# sourceMappingURL=clientSecretRoutes.js.map