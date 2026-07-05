import { browser, expect } from "@wdio/globals";
import CharacterFeature from "../feature/character.feature";
import HomeFeature from "../feature/home.feature";
import HeaderFeature from "../feature/header.feature";
import LoginFeature from "../feature/login.feature";

/**
 *  Open login modal and navigate to play page, log out, validate on errors (error flow)
 */

describe("Home and login pages", () => {
  describe("Log in", () => {
    it("should open the page", async () => {
      await HomeFeature.open();
      await expect(browser).toHaveUrl("http://localhost:3000/");
      await expect(browser).toHaveTitle("TestRPG");
    });

    it("should contain a login button in the header", async () => {
      await expect(HeaderFeature.loginButton).toHaveText("Login");
    });

    it("click on login button and open modal", async () => {
      await HeaderFeature.loginButton.click();
    });

    it("should contain a login button", async () => {
      await expect(LoginFeature.loginSubmitButton).toHaveText("Login");
    });

    it("should contain a heading and paragraph text", async () => {
      await expect(LoginFeature.loginHeading).toHaveText("Login to TestRPG");
      await expect(LoginFeature.loginParagraph).toHaveText(
        "Any combination of email and password will work",
      );
    });

    it("should contain an email address input", async () => {
      await expect(LoginFeature.loginEmailLabel).toHaveText("Email");
      await expect(LoginFeature.loginEmailInput).toHaveAttribute(
        "placeholder",
        "commandercody@foo.nl",
      );
    });

    it("should show an error when leaving email address input empty", async () => {
      await LoginFeature.loginSubmitButton.click();
      await expect(LoginFeature.loginDialogErrorEmail).toHaveText(
        "This should be an email address",
      );
    });

    it("should show an error when typing an invalid email address", async () => {
      await LoginFeature.loginEmailInput.setValue("invalidemailaddress");
      await LoginFeature.loginSubmitButton.click();
      await expect(LoginFeature.loginDialogErrorEmail).toHaveText(
        "This should be an email address",
      );
    });

    it("should fill in valid email input", async () => {
      await LoginFeature.loginEmailInput.setValue("test@testcoders.nl");
      await expect(LoginFeature.loginEmailInput).toHaveValue(
        "test@testcoders.nl",
      );
    });

    it("should contain a password input", async () => {
      await expect(LoginFeature.loginPasswordLabel).toHaveText("Password");
      await expect(LoginFeature.loginPasswordInput).toBeClickable();
    });

    it("should show an error when leaving password input empty", async () => {
      await LoginFeature.loginSubmitButton.click();
      await expect(LoginFeature.loginDialogErrorPassword).toHaveText(
        "Please enter your password",
      );
    });

    it("should fill in valid password input and login", async () => {
      await LoginFeature.loginPasswordInput.setValue("Secur3P@$$w0rd!");
      await LoginFeature.loginSubmitButton.click();
      await expect(LoginFeature.loginDialogErrorPassword).not.toBeDisplayed();
      await expect(browser).toHaveLocalStorageItem(
        "login-store",
        '{"state":{"isLoggedIn":true},"version":0}',
      );
    });
  });

  describe("Play page: Character screen", () => {
    it("should open the page", async () => {
      await CharacterFeature.open();
      await expect(browser).toHaveUrl("http://localhost:3000/play");
    });

    it("should show an error when leaving character name empty", async () => {
      await expect(CharacterFeature.characterName).toHaveText("Your character");
      await CharacterFeature.characterStartButton.click();
      await expect(CharacterFeature.characterError).toHaveText(
        "Name must be at least 3 characters",
      );
    });

    it("should show an error when typing less than 3 characters for the character name", async () => {
      await CharacterFeature.characterNameInput.addValue("ab");
      await expect(CharacterFeature.characterError).toHaveText(
        "Name must be at least 3 characters",
      );
    });

    it("should show an error when typing more than 20 characters for the character name", async () => {
      await CharacterFeature.characterNameInput.clearValue();
      await CharacterFeature.characterNameInput.addValue(
        "Really long character name",
      );
      await expect(CharacterFeature.characterError).toHaveText(
        "Name cannot be longer than 20 characters",
      );
    });
  });

  describe("Log out", () => {
    it("should contain a logout button in the header", async () => {
      await expect(HeaderFeature.logoutButton).toHaveText("Log out");
    });

    it("click on logout button", async () => {
      await HeaderFeature.logoutButton.click();
      await expect(browser).toHaveLocalStorageItem(
        "login-store",
        '{"state":{"isLoggedIn":false},"version":0}',
      );
    });
  });
});
