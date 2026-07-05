import { $ } from "@wdio/globals";

class Utils {

  /**
   * Get viewport width
   **/
  public async getViewportWidth(): Promise<number> {
    // Get the width of the viewport
    const viewportWidth: number = await $('div#root').getSize("width");

    return viewportWidth;
  }
}

export default new Utils();
