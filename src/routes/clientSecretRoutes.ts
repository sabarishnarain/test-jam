import express from 'express';
const router = express.Router();
import testHelper from '../helpers/testHelper';
import securityHelper from '../helpers/securityKeyHelper';

router.post('/auth/generate', (req: any, res: any) => {
    console.log('create client secret: ', req.body);
    const master = req.body.master;

    if (!master) {
      res.status(400).send('Master key not set in payload.');
      return;
    }

    if (securityHelper.getMasterKey() !== master) {
      res.status(500).send('Invalid master key. Buzz your admin to verify this.');
      return;
    }

    const secret = securityHelper.createSecret();
    res.status(200).send('Client secret generated successfully : ' + secret);
  });

router.post('/auth/keys', (req: any, res: any) => {
  console.log('create client secret: ', req.body);
  const master = req.body.master;

  if (!master) {
    res.status(400).send('Master key not set in payload.');
    return;
  }

  if (securityHelper.getMasterKey() !== master) {
    res.status(500).send('Invalid master key. Buzz your admin to verify this.');
    return;
  }

  const secrets = securityHelper.getSecrets();
  res.status(200).send('Secrets : ' + secrets);
});

export {router as clientSecretRoutes};
