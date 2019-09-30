import express from 'express';
const router = express.Router();
import renderer from '../renderers/renderer';
import userHelper from '../helpers/userHelper';
import projectHelper from '../helpers/projectHelper';
import util from '../utils/util';

router.get('/login*', (req: any, res: any) => {
  if (req.query.logout) {
    console.log('logout');
    req.session.username = undefined;
  }
  renderer.login(res, undefined);
});

router.post('/login*', async (req: any, res: any) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
     // edge cases
     renderer.login(res, 'You have not entered username or password.');
     return;
  }

  if (!userHelper.findUser(username)) {
    // Non-existent username
    renderer.login(res, 'Hmm.. Looks like the username does not exist. Register yourself from the link to the left.');
    return;
  }

  if (await userHelper.verifyPassword(username, password)) {
    // Login success
    req.session.username = username;
    console.log('Session ', req.session.username);
    console.log('Local var ', res.locals.isAdmin);
    renderer.home(res, projectHelper.getAllProjects(), undefined, undefined, undefined, 'Happy collaboration!');
    return;
  }

  // Incorrect password
  renderer.login(res, 'Invalid credentials');
});

router.get('/register*', (req: any, res: any) => {
  renderer.register(res, util.isSecretRequired());
});

router.post('/register*', async (req: any, res: any) => {
  const username = req.body.username;
  const password = req.body.password;
  const secretKey = req.body.secret;
  const isSecretRequired = util.isSecretRequired();

  if (!username || !password) {
    renderer.register(res, isSecretRequired, 'Username or password cannot be empty');
    return;
  }

  if (util.isSecretRequired() && !secretKey) { // check for secret only if property is enabled in config.json
    renderer.register(res, isSecretRequired, 'You must use a secret key to register. Contact the maintainer to get one.');
    return;
  }

  if (userHelper.findUser(username)) {
    renderer.register(res, isSecretRequired, `Hmm.. Looks like the username "${username}" already exists in the system.` +
    `If this is you, then contact the maintainer to investigate further.`);
    return;
  }

  try {
    await userHelper.createUser(username, password, secretKey);
  } catch (err) {
    console.error(err);
    renderer.register(res, isSecretRequired, 'Ouch! It looks like you have used an invalid/expired key. Contact the maintainer to get new one.');
    return;
  }
  renderer.login(res, undefined, 'Registration successful. You can now login to continue.');
});

export {router as authRoutes};
