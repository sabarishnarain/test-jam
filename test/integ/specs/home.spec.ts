import Session from '../pageobjects/Session';
import {assert} from 'chai';
import Projects from '../pageobjects/Projects';

describe('Project usecases', ()=> {
    it('Create Project test', () => {
        const login = Session.init();
        let home = login.loginAs('sss', 'sss');
        assert.equal(home.getSnackbar(), 'Happy Collobration!');



    })
})