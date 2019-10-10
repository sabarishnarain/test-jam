import Home from './Home';
import {waitForElements} from './common/Wait';

export default class Login {

  public waitToRender() {
    waitForElements(['#username', '#login']);
    return this;
  }

  public loginAs(username?: string, password?: string) {
    username = username || 'sudouser';
    password = password || 'sudouser';
    $('#username').addValue(username);
    $('#password').addValue(password);
    $('#login').click();
    return new Home().waitToRender();
  }
}
