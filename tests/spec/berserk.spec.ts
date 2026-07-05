import { browser, expect } from "@wdio/globals";
import AdventureFeature from "../feature/adventure.feature";
import CharacterFeature from "../feature/character.feature";

/**
 *  Open play page and activate berserk mode :-)
 */

describe("Berserk mode", () => {
  describe("Play page: Character screen", () => {
    it("should open the page", async () => {
      await CharacterFeature.open();
      await expect(browser).toHaveUrl("http://localhost:3000/play");
    });

    it("should fill in a character name", async () => {
      await CharacterFeature.characterNameInput.addValue(
        "Fancy character name",
      );
      await expect(CharacterFeature.characterNameInput).toHaveValue(
        "Fancy character name",
      );
    });

    it("should contain default build, select no other build", async () => {
      await expect(CharacterFeature.characterBuildButton).toBeDisplayed();
    });

    it("should contain character stats with default values", async () => {
      await expect(CharacterFeature.characterStats).toHaveText(
        expect.stringContaining("Stats"),
      );
      const stats: object = await CharacterFeature.getCharacterStats();
      expect(stats).toEqual({
        Strength: 1,
        Agility: 6,
        Wisdom: 2,
        Magic: 1,
      });
    });
    
    it("should contain default character level", async () => {
        const level: number = await CharacterFeature.getCharacterLevel();
        expect(level).toEqual(1);
      });


    it("should contain a Start! button, user can click", async () => {
      await expect(CharacterFeature.characterStartButton).toHaveText("Start!");
      await CharacterFeature.characterStartButton.click();
    });

    it("should contain an updated character name and build description", async () => {
      await expect(CharacterFeature.characterName).toHaveText(
        "Fancy character name",
      );
      await expect(CharacterFeature.characterDescription).toHaveText(
        "A level 1 thief",
      );
    });
  });

  describe("Play page: Adventure and character screens", () => {
    it("should contain an input to fill in and activate berserk mode", async () => {
      await AdventureFeature.typerInput.scrollIntoView();
      await expect(AdventureFeature.typerInput).toBeDisplayed();
    });

    it('should fill in "all your base are belong to us" in the input and get a confirmation message, set input to disabled', async () => {
      await AdventureFeature.typerInput.addValue(
        "all your base are belong to us",
      );
      await expect(AdventureFeature.typerInput).toHaveValue(
        "all your base are belong to us",
      );
    });

    it("click the button 5 times and get a confirmation message, set input to disabled", async () => {
      await AdventureFeature.clickAction(5);
      await expect(AdventureFeature.clickerDataTask).toHaveText(
        "Great job! You levelled up",
      );
      await expect(AdventureFeature.clickerButton).toHaveAttribute("disabled");
    });

    it("should contain maxed out character stats", async () => {
      const stats: object = await CharacterFeature.getCharacterStats();
      expect(stats).toEqual({
        Strength: 10,
        Agility: 10,
        Wisdom: 10,
        Magic: 10,
      });
    });

    it("should contain updated character level", async () => {
      const level: number = await CharacterFeature.getCharacterLevel();
      expect(level).toEqual(2);
    });
  });
});
