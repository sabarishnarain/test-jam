
export default class Page {

  public matchSnackbar(msg: string) {
    browser.waitUntil ( () => {
      return this.getSnackbarMsg() === msg;
    }, 5000, 'Expected message ' + msg + ' but was ' + this.getSnackbarMsg());
  }

  public containsSnackbarMsg(msg: string) {
    browser.waitUntil ( () => {
      return this.getSnackbarMsg().includes(msg);
    }, 5000, 'Expected message ' + msg + ' to be contained in snackbar but was ' + this.getSnackbarMsg());
  }

  private getSnackbarMsg() {
    return $('#snackbar font').getText();
  }
}
