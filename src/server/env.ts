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

function initDefault() {

  dbHelper.setDefaultContent(MODEL.APPCONFIG, {
    authentication : {
        requireSecret : true
    }
  });

  dbHelper.setDefaultContent(MODEL.USER, []);
  dbHelper.setDefaultContent(MODEL.PROJECT, []);
  dbHelper.setDefaultContent(MODEL.MASTERKEY, { key: 'nobodyownsnothing' });
  dbHelper.setDefaultContent(MODEL.SECRET, []);
  dbHelper.setDefaultContent(MODEL.TEST, []);
  dbHelper.setDefaultContent(MODEL.SPRINT, []);
  dbHelper.setDefaultContent(MODEL.TESTRUN, []);

}

export {initDefault as initializeContents};
