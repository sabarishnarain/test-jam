import Session from '../page-objects/Session';

describe ('Login use cases', () => {
  it ('Login as valid user', () => {
    const login = Session.init();
    login.loginAs('sudouser', 'sudouser');
  });
});
