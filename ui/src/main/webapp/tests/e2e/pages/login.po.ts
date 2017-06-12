import {browser, by, element} from "protractor";

export class LoginPage {
    username = element(by.css('#username'));
    password = element(by.css('#password'));
    loginButton = element(by.css('#kc-login'));

    public navigateTo() {
        browser.get('/rhamt-web/');
    }

    public login(user: string, password: string) {
        this.username.sendKeys(user);
        this.password.sendKeys(password);
        this.loginButton.click();
    }
}
