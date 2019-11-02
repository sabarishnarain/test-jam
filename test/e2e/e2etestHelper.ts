import request from 'request';

export async function executePost(options: any, logBody: boolean = false) {
  return new Promise( (resolve, reject) => {
    request.post(options, (err: any, res: any, body: any) => {
      if (err) {
        console.error(err);
        return reject(body);
      }
      if (logBody) {
        console.log(body);
      }
      return resolve(res.statusCode);
    });
  });
}

export const VALID_PARAMS = {
  status : 'PASS',
  build : '100'
};

export const WITHOUT_BUILD = {
  status : 'PASS',
  invalidKey : 'some vaue'
};

export const WITHOUT_STATUS = {
  invalidKey : 'invalid status',
  build : '100'
};
