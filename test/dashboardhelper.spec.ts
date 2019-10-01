import { expect } from 'chai';
import chai from 'chai';
import dashboardhelper from '../src/helpers/dashboardHelper';

// tslint:disable-next-line: no-var-requires
chai.use(require('chai-string'));

describe('Dashboard Helper Tests', () => {

  // Resurrect this after we have sample data
  xit('Should return some meaningful data', () => {
    // tslint:disable-next-line: no-unused-expression
    expect(dashboardhelper.getData()).to.not.undefined;
  });

 });
