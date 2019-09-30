import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import sass from 'node-sass-middleware';
import path from 'path';
import {projectRoutes} from './routes/projectRoutes';
import {homeRoute} from './routes/homeRoutes';
import {dashboardRoutes} from './routes/dashboardRoutes';
import {addTestRoutes} from './routes/addTestRoutes';
import {e2eRoutes} from './routes/e2eRoutes';
import {editTestRoutes} from './routes/editTestRoutes';
import {authRoutes} from './routes/authRoutes';
import {clientSecretRoutes} from './routes/clientSecretRoutes';
import {userRoutes} from './routes/userRoutes';
import {runTestRoutes} from './routes/runTestRoutes';

import session from 'express-session';

import {renderFile} from 'ejs';
import renderer from './renderers/renderer';
import userHelper from './helpers/userHelper';

const port = (process.env.JDAM_ENV_PROD === 'true') ? 80 : 3000;

app.engine('html', renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use( sass( {
  src: path.join(__dirname, '..', '/scss'),
  dest: path.join(__dirname, '..', '/css'),
  // debug: true
}));
app.set('view engine', 'ejs');
app.use(express.static('./dist/client/css'));
app.use(express.static('./dist/client/js'));
app.use(express.static('./dist/client/images'));
app.use(session({
  secret: 'keyboard cat'
}));

app.use( (req: any, res: any, next) => {
  console.log('Bip! ' + req.session.username);
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.get('*', (req: any, res: any, next: any) => {
  if (req.session.username || req.originalUrl.endsWith('register.html') || req.originalUrl.endsWith('about.html')) {
    next();
  } else {
    renderer.login(res, 'Whoops! Session expired. Login to continue');
  }
});

app.get('/about*', (req: any, res: any) => {
  renderer.aboutUs(res);
});

// use modular routes
app.use(projectRoutes);
app.use(homeRoute);
app.use(dashboardRoutes);
app.use(addTestRoutes);
app.use(e2eRoutes);
app.use(editTestRoutes);
app.use(authRoutes);
app.use(clientSecretRoutes);
app.use(userRoutes);
app.use(runTestRoutes);

app.listen(port);
