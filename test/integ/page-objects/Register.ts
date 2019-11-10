import Home from './Home';
import {waitForElements} from './common/Wait';

export default class Register {

  public waitToRender() {
    waitForElements(['#username', '#password', '#register']);
    return this;
  }

  public fillIn(username: string, password: string, secret: string) {
    $('#username').addValue(username);
    $('#password').addValue(password);
    $('#secret').addValue(secret);
  }

  public register() {
    $('#register').click();
  }

  public getErrorMsg() {
    return $('.errorMsg').getText().trim();
  }
}
