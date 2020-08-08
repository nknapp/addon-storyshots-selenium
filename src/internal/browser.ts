import { WebDriver } from "selenium-webdriver";
import { Extent } from "./extent";
import { getViewportSize, resizeStoryview, setupStoryviewIframe } from "./in-page-scripts";
import { WidthXHeightString } from "../types";
import sharp from "sharp";
import { addDebugLogToClass } from "./class-debug";
import createDebug from "debug";

type WithDriver<T> = T & { driver: WebDriver };

type CallbackWithDriver<P, R> = (argWithDriver: WithDriver<P>) => Promise<R>;

export class Browser {
	private readonly driver: WebDriver;
	public readonly id: string;
	private viewportSize: Extent;
	private storyviewSize: Extent;

	constructor(driver: WebDriver, id: string) {
		this.driver = driver;
		this.id = id;
	}

	async prepareBrowser(screenshotUrl: string): Promise<void> {
		await this.driver.get("about:blank");
		await this.driver.manage().window().maximize();
		await this.driver.executeScript(setupStoryviewIframe, screenshotUrl);
		this.viewportSize = await Extent.of(await this.driver.executeScript(getViewportSize));
	}

	async resizeTo(size: WidthXHeightString): Promise<void> {
		this.storyviewSize = Extent.fromSizeString(size);
		return this.driver.executeScript(
			resizeStoryview,
			this.storyviewSize.width,
			this.storyviewSize.height
		);
	}

	async callHook<P, R>(callback: CallbackWithDriver<P, R>, args: P): Promise<R> {
		return callback({
			...args,
			driver: this.driver,
		});
	}

	async takeScreenshot(): Promise<Buffer> {
		const windowScreenshotBase64 = await this.driver.takeScreenshot();
		const windowScreenshot = Buffer.from(windowScreenshotBase64, "base64");
		const actualSize = this.storyviewSize.intersection(this.viewportSize);
		return this.extractStoryViewFromScreenshot(windowScreenshot, actualSize);
	}

	private async extractStoryViewFromScreenshot(screenshot: Buffer, { width, height }) {
		try {
			return await sharp(screenshot)
				.extract({ left: 0, top: 0, width, height })
				.png({ compressionLevel: 9 })
				.toBuffer();
		} catch (error) {
			throw new Error(
				`Error extracting screenshot of size ${width}x${height} for browser "${this.id}"`
			);
		}
	}
}

export const DebugLoggingBrowser: typeof Browser = addDebugLogToClass(
	createDebug("addon-storyshots-selenium:browser-trace"),
	(driver, browserId) => `WebDriverActions(${browserId})`,
	Browser
);