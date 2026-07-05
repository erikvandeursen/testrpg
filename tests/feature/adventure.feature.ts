import { $, browser } from "@wdio/globals";
import Page from "../page/page.js";

const BREAKPOINT_WIDTH = 1216;
const CLICK_PAUSE_MS = 100;
const SLIDER_OFFSET_RIGHT = 12;
const WIDE_VIEWPORT_DRAG_DISTANCE = 476;

class AdventureFeature extends Page {
  /**
   * Define locators using getter methods
   */
  public get adventureContainer() {
    return $('[data-testid="adventure-container"]');
  }

  public get adventureContainerHeading() {
    return $('[data-testid="adventure-container"] h3');
  }

  public get clickerLabel() {
    return $('[data-testid="adventure-clicker"] h3');
  }

  public get clickerButton() {
    return $('[data-testid="clicker-button"]');
  }

  public get clickerDataTask() {
    return $('[data-task="clicker"]');
  }

  public get uploaderLabel() {
    return $('[data-testid="adventure-uploader"] h3');
  }

  public get uploaderInput() {
    return $('[data-testid="uploader-input"]');
  }

  public get uploaderDataTask() {
    return $('[data-task="uploader"]');
  }

  public get typerLabel() {
    return $('[data-testid="adventure-typer"] h3');
  }

  public get typerInput() {
    return $('[data-testid="typer-input"]');
  }

  public get typerDataTask() {
    return $('[data-task="typer"]');
  }

  public get sliderLabel() {
    return $('[data-testid="adventure-slider"] h3');
  }

  public get sliderInput() {
    return $('[data-testid="slider-input"]');
  }

  public get sliderDataTask() {
    return $('[data-task="slider"]');
  }

  public get maxLevelMessage() {
    return $('[data-testid="max-level-message"]');
  }

  public get playAgainButton() {
    return $('[data-testid="play-again-button"]');
  }

  private get sliderInputSpan() {
    return $('[data-testid="slider-input"] span[role="slider"]');
  }

  private get root() {
    return $("div#root");
  }

  /**
   * Click the 'Click it' button multiple times
   * @param numberOfClicks Provide the number of clicks
   **/
  public async clickAction(numberOfClicks: number): Promise<void> {
    // Validate against click input being null, undefined, 0, and NaN
    if (!numberOfClicks) {
      throw new Error("No number of clicks provided");
    }
    // Validate against click input being a non-integer or negative number
    if (!Number.isInteger(numberOfClicks) || numberOfClicks < 1) {
      throw new Error(
        `numberOfClicks must be a positive integer, received: ${numberOfClicks}`,
      );
    }
    // Loop the click button x number of times as provided by the numberOfClicks parameter, with a small pause between each click
    for (let i: number = 0; i < numberOfClicks; i++) {
      await this.clickerButton.click();
      await browser.action("pointer").pause(CLICK_PAUSE_MS).perform();
    }
  }

  /**
   * Upload a file
   * @param filepath Provide the file path to the file to upload
   **/
  public async fileUpload(filepath: string): Promise<void> {
    // Validate against file path being null, undefined, or empty
    if (!filepath) {
      throw new Error("No file path provided");
    }
    // Upload file user using WDIO native uploadFile command
    try {
      const remoteFilePath = await (browser).uploadFile(
        filepath,
      );
      await this.uploaderInput.setValue(remoteFilePath);
    } catch (error) {
      throw new Error(
        `Failed to upload file at "${filepath}": ${(error as Error).message}`, { cause: error },
      );
    }
  }

  /**
   * Drag the slider using a simulated pointer action (left button down)
   **/
  public async dragSlider(): Promise<void> {
    // Get the viewport size to determine slider input width
    const viewportWidth: number = await this.getViewportWidth();
    const inputWidth: number = await this.sliderInput.getSize("width");
    const origin = this.sliderInputSpan;

    // Validate against viewport being infinite or negative
    if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) {
      throw new Error(`Invalid viewport width: ${viewportWidth}`);
    }
    if (!Number.isFinite(inputWidth) || inputWidth <= 0) {
      throw new Error(`Invalid slider input width: ${inputWidth}`);
    }

    // On wide viewports, use a fixed drag distance;
    // on narrow viewports, derive it from the actual input width minus a right-hand offset
    const elemWidth =
      viewportWidth >= BREAKPOINT_WIDTH
        ? WIDE_VIEWPORT_DRAG_DISTANCE
        : inputWidth - SLIDER_OFFSET_RIGHT;

    // Move the slider to the right by x pixes as provided by the elemWidth constant
    await browser
      .action("pointer")
      .move({ origin, x: elemWidth, y: 0 })
      .down({ button: 0 })
      .up({ button: 0 })
      .perform();
  }

  /**
   * Get viewport width
   **/
  private async getViewportWidth(): Promise<number> {
    // Get the width of the viewport
    const viewportWidth: number = await this.root.getSize("width");

    return viewportWidth;
  }
}

export default new AdventureFeature();
