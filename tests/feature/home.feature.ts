import { $ } from "@wdio/globals";
import Page from "../page/page.js";

class HomeFeature extends Page {
  /**
   * Define locators using getter methods
   */
  public get hero() {
    return $('[data-testid="hero"]');
  }

  public get playLink() {
    return $('[data-testid="play-link"]');
  }

  public get githubLink() {
    return $('[data-testid="github-link"]');
  }

  /**
   * Overwrite specific options to adapt it to page object
   */
  public open() {
    return super.open("");
  }
}

export default new HomeFeature();
