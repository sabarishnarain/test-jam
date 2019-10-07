import Login from './Login';

export default class Session {

    public static init(url?: string) {
        const urlStr = url || 'http://localhost:3000';
        browser.url(urlStr);
        return new Login().waitToLoad();
    }
}