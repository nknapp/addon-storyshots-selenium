import { WebDriver } from "selenium-webdriver";
import { Extent } from "./extent";
import { getViewportSize, resizeStoryview, setupStoryview } from "../in-page-scripts";

import createDebug from "debug";
import { createSectionDebug } from "./internal-utils";
const sectionDebug = createSectionDebug(
	createDebug("addon-storyshots-selenium:WebDriverActions-trace")
);

export class WebDriverActions {
	private readonly driver: WebDriver;
	private readonly browserId: string;

	constructor(driver: WebDriver, browserId: string) {
		this.driver = driver;
		this.browserId = browserId;
	}

	async setupBlankPage(): Promise<void> {
		await this.withLog("setup blank page", () => this.driver.get("about:blank"));
	}

	async maximiseBrowserWindow(): Promise<void> {
		await this.withLog("maximise browser window", () => this.driver.manage().window().maximize());
	}

	async setupStoryviewIframe(screenshotUrl: string): Promise<void> {
		await this.withLog("setupStoryView", () =>
			this.driver.executeScript(setupStoryview, screenshotUrl)
		);
	}

	async getViewportSize(): Promise<Extent> {
		return this.withLog("get viewport size", async () => {
			return Extent.of(await this.driver.executeScript(getViewportSize));
		});
	}

	async resizeStoryviewIframeTo(size: Extent): Promise<void> {
		await this.withLog(`resize storyView to ${size}`, () =>
			this.driver.executeScript(resizeStoryview, size.width, size.height)
		);
	}

	async takeScreenshot(): Promise<string> {
		return this.withLog("take screenshot", () => this.driver.takeScreenshot());
	}

	private withLog<T>(section: string, fn: () => T): T {
		return sectionDebug(`${section} for browser "${this.browserId}`, fn);
	}
}
