import {assert} from 'chai';
import testHelper from '../../src/helpers/testHelper';
import * as e2etestHelper from './e2etestHelper';

describe('E2E routes - By ID', () => {

  it('By Id - Should return 400 for no params', async () => {
    const resCode = await e2etestHelper.executePost({
      url: e2etestHelper.TEST_SERVER_URL + '/tests/1/update'
    });
    assert.equal(400, resCode);
  });

  it('By Id - Should return 400 for no status param', async () => {
    const resCode = await e2etestHelper.executePost({
      form: e2etestHelper.WITHOUT_STATUS,
      url: e2etestHelper.TEST_SERVER_URL + '/tests/1/update'
    });
    assert.equal(400, resCode);
  });

  it('By Id - Should return 400 for no build param', async () => {
    const resCode = await e2etestHelper.executePost({
      form: e2etestHelper.WITHOUT_BUILD,
      url: e2etestHelper.TEST_SERVER_URL + '/tests/1/update'
    });
    assert.equal(400, resCode);
  });

  it('By Id - Should return 400 for invalid status', async () => {
    const resCode = await e2etestHelper.executePost({
      form: {
        status : 'INVALID STATUS',
        build : '100'
      },
      url: e2etestHelper.TEST_SERVER_URL + '/tests/1/update'
    });
    assert.equal(400, resCode);
  });

  it('By Id - Should return 500 for test not found', async () => {
    const resCode = await e2etestHelper.executePost({
      form: e2etestHelper.VALID_PARAMS,
      url: e2etestHelper.TEST_SERVER_URL + '/tests/11/update'
    });
    assert.equal(500, resCode);
  });

  it('By Id - Should return 200 for test update', async () => {

    const initRuns = testHelper.getHistoryForTest(1).length;
    let resCode = await e2etestHelper.executePost({
      form: e2etestHelper.VALID_PARAMS,
      url: e2etestHelper.TEST_SERVER_URL + '/tests/1/update'
    });
    assert.equal(200, resCode);
    assert.equal(initRuns + 1, testHelper.getHistoryForTest(1).length);
    // Run test once again
    resCode = await e2etestHelper.executePost({
      form: e2etestHelper.VALID_PARAMS,
      url: e2etestHelper.TEST_SERVER_URL + '/tests/1/update'
    });
    assert.equal(200, resCode);
    assert.equal(initRuns + 2, testHelper.getHistoryForTest(1).length);

  });

});
