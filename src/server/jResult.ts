export default class jResult {

  public err: any;
  public successMsg: string;

  constructor(err: any, successMsg?: string) {
    this.err = err;
    this.successMsg = successMsg;
  }

}
