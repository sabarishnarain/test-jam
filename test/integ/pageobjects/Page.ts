
export default class Page {
  public goToAddTest(cb : any) {
    $('a[href="./addNewTest.html"]').click();
    return cb();
  }

  public goToProjects(cb : any) {
    $('a[href="./projects.html"]').click();
    return cb();
  }

  public getSnackbar() {
    return $('#snackbar font').getText();
  }
}