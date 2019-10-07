export default class jResult {

  public err: any;
  public success: any;

  constructor(err: any, success?: any) {
    this.err = err;
    this.success = success;
  }

}
