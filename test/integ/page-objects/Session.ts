import Login from './Login';

export default class Session {

  public static init(url?: string) {
    const urlStr = url || 'http://localhost:3000';
    browser.url(urlStr);
    browser.setWindowSize(1580, 1180);
    return new Login().waitToRender();
  }
}
