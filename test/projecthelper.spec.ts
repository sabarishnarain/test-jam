import { expect } from 'chai';
import chai from 'chai';
import projectHelper from '../src/helpers/projectHelper';
import {initializeContents} from '../src/server/env';

// tslint:disable-next-line: no-var-requires
chai.use(require('chai-string'));

describe('Project Helper Tests', () => {

  before( async () => {
    await initializeContents();
  });

  it('Project with single word should be first 3 letters', () => {
    expect(projectHelper.generateProjectCode('foobar')).to.startsWith('foo');
  });

  it('Project id for two words should start with first two letters of two words', () => {
    expect(projectHelper.generateProjectCode('foo bar')).to.startsWith('fob');
  });

  it('Project id for three words should start with first two letters of each words', () => {
    expect(projectHelper.generateProjectCode('foo bar true')).to.startsWith('fobatr');
  });
})
