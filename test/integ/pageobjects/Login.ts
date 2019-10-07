import {waitForElements} from './common/Wait';
import Home from './Home';

export default class Login {
 
  public waitToLoad() {
    waitForElements(['#username', '#password', '#login']);
    return this;
  }

  public loginAs(username: string, password: string) { 
    $('#username').addValue(username);
    $('#password').addValue(password);
    $('#login').click();
    return new Home().waitToLoad();
  }
}