import { $ } from "@wdio/globals";
import Page from "../page/page.js";

class HeaderFeature extends Page {
  /**
   * Define locators using getter methods
   */

  public get loginButton() {
    return $('[data-testid="login-button"]');
  }

  public get logoutButton() {
    return $('[data-testid="logout-button"]');
  }
}

export default new HeaderFeature();
