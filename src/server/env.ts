/**
 * Environment configuration.
 *
 * You may set different values to TESTJAM_ENV.
 *  prod - production
 *  test - the unit tests will use this path to create test artifacts.
 *  dev - local development environment
 *  demo - will use demo datasets.
 *
 *  Default is dev
 *
 */
function globalConfig() {

  if (process.env.TESTJAM_ENV === 'prod') {
    return {
      port : 80,
      subDir : 'prod'
    };
  } else if (process.env.TESTJAM_ENV === 'test') {
    return {
      port : 3000,
      subDir : 'test'
    };
  } else if (process.env.TESTJAM_ENV === 'demo') {
    return {
      port : 80,
      subDir : 'demo'
    };
  }

  return {
    port : 3000,
    subDir : 'dev'
  };
}

const env = globalConfig();
export {env as env};

import dbHelper, { MODEL } from '../helpers/dbHelper';
import {DBContents} from './dbContents';

function initializeDB() {

  const data  = (process.env.TESTJAM_ENV === 'test') ? DBContents.TEST : DBContents.DEFAULT;
  dbHelper.setDefaultContent(MODEL.APPCONFIG, data.appConfig);

  dbHelper.setDefaultContent(MODEL.USER, data.users);
  dbHelper.setDefaultContent(MODEL.PROJECT, data.projects);
  dbHelper.setDefaultContent(MODEL.MASTERKEY, data.masterKey);
  dbHelper.setDefaultContent(MODEL.SECRET, data.secrets);
  dbHelper.setDefaultContent(MODEL.TEST, data.tests);
  dbHelper.setDefaultContent(MODEL.SPRINT, data.sprints);
  dbHelper.setDefaultContent(MODEL.TESTRUN, data.testruns);

}

export {initializeDB as initializeDB};
