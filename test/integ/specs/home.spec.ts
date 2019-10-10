import Session from '../page-objects/Session';
import {assert} from 'chai';
import Home from '../page-objects/Home';

describe('Project usecases', () => {
  it('Create Project test', () => {
    const login = Session.init();
    const home: Home = login.loginAs();
    home.matchSnackbar('Happy Collaboration!');

  });
 });
