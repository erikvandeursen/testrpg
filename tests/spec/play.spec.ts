import { browser, expect } from "@wdio/globals";
import HomeFeature from "../feature/home.feature";
import CharacterFeature from "../feature/character.feature";
import AdventureFeature from "../feature/adventure.feature";

/**
 *  Open home page and navigate to play page, fill in character and adventure screens (happy flow)
 */

describe("Home and play pages", () => {
  describe("Home page", () => {
    it("should open the page", async () => {
      await HomeFeature.open();
      await expect(browser).toHaveUrl("http://localhost:3000/");
      await expect(browser).toHaveTitle("TestRPG");
    });

    it("should verify the hero", async () => {
      await expect(HomeFeature.hero).toHaveText(
        expect.stringContaining(
          `TestRPG is a simple 'game' meant to be automated through a Test Automation Framework.`,
        ),
      );
    });

    it("should verify the links", async () => {
      await expect(HomeFeature.playLink).toHaveText("Click here to play");
      await expect(HomeFeature.playLink).toBeClickable();

      await expect(HomeFeature.githubLink).toHaveText("View on Github");
      await expect(HomeFeature.githubLink).toBeClickable();
    });

    it("should click on the play link", async () => {
      await HomeFeature.playLink.click();
      await expect(browser).toHaveUrl("http://localhost:3000/play");
    });
  });

  describe("Play page: Character screen", () => {
    it("should contain a heading", async () => {
      await expect(CharacterFeature.characterFormCardHeading).toHaveText(
        expect.stringContaining(`Choose a name and build`),
      );
    });

    it("should contain a character default name and build description", async () => {
      await expect(CharacterFeature.characterName).toHaveText("Your character");
      await expect(CharacterFeature.characterDescription).toHaveText(
        "A level 1 thief",
      );
    });

    it("should contain character image", async () => {
      await expect(CharacterFeature.characterImage).toBeDisplayed();
      await expect(CharacterFeature.characterImageSrc).toHaveAttribute("src");
    });

    it("should contain character stats with default values", async () => {
      await expect(CharacterFeature.characterStats).toHaveText(
        expect.stringContaining(`Stats`),
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
      await expect(CharacterFeature.characterLevel).toHaveText(
        expect.stringContaining("Level"),
      );
      const level: number = await CharacterFeature.getCharacterLevel();
      expect(level).toEqual(1);
    });

    it("should contain a character name input", async () => {
      await expect(CharacterFeature.characterNameLabel).toHaveText(
        "Character name",
      );
      await expect(CharacterFeature.characterNameInput).toHaveAttribute(
        "placeholder",
        "Galactic space lord",
      );
    });

    it("should fill in a character name", async () => {
      await CharacterFeature.characterNameInput.addValue(
        "Fancy character name",
      );
      await expect(CharacterFeature.characterNameInput).toHaveValue(
        "Fancy character name",
      );
    });

    it("should contain a build input", async () => {
      await expect(CharacterFeature.characterBuildLabel).toHaveText("Build");
      await expect(CharacterFeature.characterBuildButton).toHaveText("Thief");
    });

    it("select a build", async () => {
      await expect(CharacterFeature.characterBuildButton).toBeDisplayed();
      await CharacterFeature.characterBuildButton.click();
      await CharacterFeature.setCharacterBuild("Knight");
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
        "A level 1 knight",
      );
    });

    it("should contain character stats for selected character", async () => {
      const stats: object = await CharacterFeature.getCharacterStats();
      expect(stats).toEqual({
        Strength: 6,
        Agility: 2,
        Wisdom: 1,
        Magic: 1,
      });
    });

    it("should contain updated character level", async () => {
      const level: number = await CharacterFeature.getCharacterLevel();
      expect(level).toEqual(1);
    });
  });

  describe("Play page: Adventure and character screens", () => {
    it("should contain a heading", async () => {
      await AdventureFeature.adventureContainerHeading.scrollIntoView();
      await expect(AdventureFeature.adventureContainerHeading).toHaveText(
        "Adventure time",
      );
    });

    it("should contain a button to level up", async () => {
      await expect(AdventureFeature.clickerLabel).toHaveText("Click it!");
      await expect(AdventureFeature.clickerButton).toBeDisplayed();
      await expect(AdventureFeature.clickerButton).toHaveText(
        "Click me 5 times",
      );
    });

    it("click the button 5 times and get a confirmation message, set input to disabled", async () => {
      await AdventureFeature.clickAction(5);
      await expect(AdventureFeature.clickerDataTask).toHaveText(
        "Great job! You levelled up",
      );
      await expect(AdventureFeature.clickerButton).toHaveAttribute("disabled");
    });

    it("should contain updated character stats", async () => {
      const stats: object = await CharacterFeature.getCharacterStats();
      expect(stats).toEqual({
        Strength: 7,
        Agility: 3,
        Wisdom: 2,
        Magic: 2,
      });
    });

    it("should contain updated character level", async () => {
      const level: number = await CharacterFeature.getCharacterLevel();
      expect(level).toEqual(2);
    });

    it("should contain a input to upload a file", async () => {
      await expect(AdventureFeature.uploaderLabel).toHaveText("Upload it!");
      await expect(AdventureFeature.uploaderInput).toBeDisplayed();
    });

    it("upload a file and get a confirmation message, set input to disabled", async () => {
      await AdventureFeature.fileUpload("tests/assets/input-file.txt");
      await expect(AdventureFeature.uploaderDataTask).toHaveText(
        "File selected, level up!",
      );
    });

    it("should contain updated character stats", async () => {
      const stats: object = await CharacterFeature.getCharacterStats();
      expect(stats).toEqual({
        Strength: 8,
        Agility: 4,
        Wisdom: 3,
        Magic: 3,
      });
    });

    it("should contain updated character level", async () => {
      const level: number = await CharacterFeature.getCharacterLevel();
      expect(level).toEqual(3);
    });

    it('should contain an input to fill in "Lorem Ipsum"', async () => {
      await expect(AdventureFeature.typerLabel).toHaveText("Type it!");
      await expect(AdventureFeature.typerInput).toBeDisplayed();
      await expect(AdventureFeature.typerInput).toBeClickable();
    });

    it('should fill in "Lorem Ipsum" in the input and get a confirmation message, set input to disabled', async () => {
      await AdventureFeature.typerInput.addValue("Lorem Ipsum");
      await expect(AdventureFeature.typerInput).toHaveValue("Lorem Ipsum");
      await expect(AdventureFeature.typerDataTask).toHaveText(
        "Dolar sit amet!",
      );
      await expect(AdventureFeature.typerInput).toHaveAttribute("disabled");
    });

    it("should contain updated character stats", async () => {
      const stats: object = await CharacterFeature.getCharacterStats();
      expect(stats).toEqual({
        Strength: 9,
        Agility: 5,
        Wisdom: 4,
        Magic: 4,
      });
    });

    it("should contain updated character level", async () => {
      const level: number = await CharacterFeature.getCharacterLevel();
      expect(level).toEqual(4);
    });

    it("should contain a slider", async () => {
      await expect(AdventureFeature.sliderLabel).toHaveText("Slide it!");
      await expect(AdventureFeature.sliderInput).toBeDisplayed();
      await expect(AdventureFeature.sliderInput).toBeClickable();
    });

    it("drag the slider to right and get a confirmation message, set input to disabled", async () => {
      await AdventureFeature.dragSlider();
      await expect(AdventureFeature.sliderDataTask).toHaveText(
        "Slid to the next level!",
      );
      await expect(AdventureFeature.sliderInput).toHaveAttribute(
        "data-disabled",
      );
    });

    it("should contain updated character stats", async () => {
      const stats: object = await CharacterFeature.getCharacterStats();
      expect(stats).toEqual({
        Strength: 10,
        Agility: 6,
        Wisdom: 5,
        Magic: 5,
      });
    });

    it("should contain updated character level", async () => {
      const level: number = await CharacterFeature.getCharacterLevel();
      expect(level).toEqual(5);
    });

    it("should display a max level message with button to play again", async () => {
      await expect(AdventureFeature.maxLevelMessage).toHaveText(
        "You've reached the highest level!",
      );
      await expect(AdventureFeature.playAgainButton).toHaveText("Play again");
      await expect(AdventureFeature.playAgainButton).toBeClickable();
    });
  });
});
