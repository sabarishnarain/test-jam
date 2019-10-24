import OtherTest from './OtherTest';

export default class OtherTestList {

  private otherTestList: OtherTest[];

  constructor(otherTestList: OtherTest[]) {
      this.otherTestList = otherTestList;
  }

  public getOtherTests() {
    return this.otherTestList;
  }

  public count() {
      return this.otherTestList.length;
  }
}