import { $, $$, browser } from "@wdio/globals";
import { Key } from "webdriverio";
import Page from "../page/page.js";

type CharacterStats = {
  Strength: number;
  Agility: number;
  Wisdom: number;
  Magic: number;
};

type CharacterBuild = "Thief" | "Knight" | "Mage" | "Brigadier";

/**
 * Class to interact with character elements on /play page
 */
class CharacterFeature extends Page {
  /**
   * Define locators using getter methods
   */

  public get characterName() {
    return $('[data-testid="character-name"]');
  }

  public get characterDescription() {
    return $('[data-testid="character-description"]');
  }

  public get characterImage() {
    return $('[data-testid="character-image"]');
  }

  public get characterImageSrc() {
    return $('[data-testid="character-image"] > img');
  }

  public get characterStats() {
    return $('[data-testid="character-stats"]');
  }

  public get characterLevel() {
    return $('[data-character-stats="Level"]');
  }

  public get characterFormCardHeading() {
    return $('[data-testid="character-form-card"] h3');
  }

  public get characterNameLabel() {
    return $(
      '[data-testid="character-form-card"] fieldset div:first-child label',
    );
  }

  public get characterNameInput() {
    return $('[data-testid="character-name-input"]');
  }

  public get characterBuildLabel() {
    return $(
      '[data-testid="character-form-card"] fieldset div:last-child label',
    );
  }

  public get characterBuildButton() {
    return $('[data-testid="character-build-select"]');
  }

  public get characterStartButton() {
    return $('[data-testid="character-start-button"]');
  }

  public get characterError() {
    return $('[data-testid="character-form-card"] p.text-destructive');
  }

  private get statSpans() {
    return $$('section[data-testid="character-stats"] span');
  }

  private get levelSpan() {
    return $('[data-character-stats="Level"] span');
  }

  /**
   * Get the character stats for given character
   * Returns an object of the 4 strengths
   **/
  public async getCharacterStats(): Promise<CharacterStats> {
    const keys: Array<keyof CharacterStats> = [
      "Strength",
      "Agility",
      "Wisdom",
      "Magic",
    ];

    const elems = this.statSpans;
    const count = await elems.length;

    // Validate against stats found
    if (count !== keys.length) {
      throw new Error(
        `Expected ${keys.length} character stats, found ${count}`,
      );
    }

    // Get the string value for elements fouind in the span
    const values = await Promise.resolve(await elems.map((elem) => elem.getText()));

    // Create an object with the keys and values
    return keys.reduce((stats, key, i) => {
      const value = Number(values[i]);
      if (Number.isNaN(value)) {
        throw new Error(`Stat "${key}" is not a valid number: "${values[i]}"`);
      }
      stats[key] = value;
      return stats;
    }, {} as CharacterStats);
  }

  /**
   * Get the character level for given character.
   * Returns a level as a number value
   **/
  public async getCharacterLevel(): Promise<number> {
    const level: number = Number(await this.levelSpan.getText());

    if (Number.isNaN(level)) {
      throw new Error(`Character level is not a valid number: "${level}"`);
    }

    return level;
  }

  /**
   * Set the character build
   * @param build - Character build
   * Returns the selected value from the dropdown by using keys
   **/
  public async setCharacterBuild(build: CharacterBuild): Promise<void> {
    // Validate against build being null, undefined, or empty
    if (!build) {
      throw new Error("No character build provided");
    }
    // Set build by sending keys to the button element, provided by the build parameter
    await browser.keys(build);
    await browser.keys(Key.Enter);
  }

  /**
   * Overwrite specific options to adapt it to page object
   */
  public open() {
    return super.open("play");
  }
}

export default new CharacterFeature();
