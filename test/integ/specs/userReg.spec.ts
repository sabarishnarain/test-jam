import Session from '../page-objects/Session';
import {assert} from 'chai';
import Links from '../page-objects/common/Links';
import Register from '../page-objects/Register';
import Home from '../page-objects/Home';
import Login from '../page-objects/Login';

describe('User registration usecases', () => {
  it('Register and re-register with same user to see error msg ', () => {
    Session.init();

    let register: Register = Links.register();

    // register using existing user, with valid key to see error msg
    register.fillIn('sudouser', 'sudouser', 'samplekey1');
    register.register();
    assert.equal(`The username "sudouser" already exists in the system.` +
    ` If this is you, contact the maintainer to investigate further.`, register.getErrorMsg());

    // register using new username but invalid secret
    register.fillIn('tempuser', 'tempuser', 'invalidsecret');
    register.register();
    assert.equal(`Ouch! It looks like you have used an invalid/expired key.` +
             ` Contact the maintainer to get new one.`, register.getErrorMsg());

    // register using new username and valid key
    register.fillIn('tempuser', 'tempuser', 'samplekey1');
    register.register();
    const login = new Login().waitToRender();
    login.loginAs('tempuser', 'tempuser');
    // user should be able to login
    Links.logout();
    new Login().waitToRender();

    // Now try to reuse the same secret key to register and it should bomb out
    register = Links.register();
    register.fillIn('newuser', 'newuser', 'samplekey1');
    register.register();
    assert.equal(`Ouch! It looks like you have used an invalid/expired key.` +
    ` Contact the maintainer to get new one.`, register.getErrorMsg());

  });
 });
