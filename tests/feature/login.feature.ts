import { $ } from "@wdio/globals";
import Page from "../page/page.js";

class LoginFeature extends Page {
  /**
   * Define locators using getter methods
   */
  public get loginDialog() {
    return $('[data-testid="login-dialog"]');
  }

  public get loginHeading() {
    return $('[data-testid="login-dialog"] h2');
  }

  public get loginParagraph() {
    return $('[data-testid="login-dialog"] p');
  }

  public get loginEmailLabel() {
    return $('[data-testid="login-dialog"] form div:first-child label');
  }

  public get loginEmailInput() {
    return $('[data-testid="login-email-input"]');
  }

  public get loginPasswordLabel() {
    return $('[data-testid="login-dialog"] form div:last-child label');
  }

  public get loginPasswordInput() {
    return $('[data-testid="login-password-input"]');
  }

  public get loginSubmitButton() {
    return $('[data-testid="login-submit-button"]');
  }

  public get loginDialogErrorEmail() {
    return $('[data-testid="login-dialog"] div:first-child p.text-destructive');
  }

  public get loginDialogErrorPassword() {
    return $('[data-testid="login-dialog"] div:last-child p.text-destructive');
  }

  /**
   * Interact with login modal form
   * @param username - Provided username
   * @param password - Provided password
   */
  public async login(username: string, password: string) {
    await this.loginEmailInput.addValue(username);
    await this.loginPasswordInput.addValue(password);
    await this.loginSubmitButton.click();
  }

  /**
   * Overwrite specific options to adapt it to page object
   */
  public open() {
    return super.open("login");
  }
}

export default new LoginFeature();
