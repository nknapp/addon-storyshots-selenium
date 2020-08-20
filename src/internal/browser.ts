import { Builder, WebDriver } from "selenium-webdriver";
import { getViewportSize, resizeStoryview, setupStoryviewIframe } from "./in-page-scripts";
import { BrowserSpecification, WidthXHeightString } from "../types";
import sharp from "sharp";
import createDebug from "debug";
import { WidthAndHeight } from "./internal-types";
import { intersect, parseSize } from "./utils/sizes";
import { addDebugLogAllMethods } from "./utils/class-debug";

const debug = createDebug("addon-storyshot-selenium:browser");

export interface Browser {
	readonly id: string;
	readonly driver: WebDriver;
	prepareBrowser(url: string): Promise<void>;
	resizeTo(size: WidthXHeightString): Promise<void>;
	takeScreenshot(): Promise<Buffer>;
	close(): Promise<void>;
	getCurrentUrl(): string;
}

class BrowserImpl implements Browser {
	readonly driver: WebDriver;
	readonly id: string;
	private viewportSize: WidthAndHeight;
	private storyviewSize: WidthAndHeight;
	private currentUrl: string;

	constructor(seleniumUrl: string, browser: BrowserSpecification) {
		this.id = browser.id;
		this.driver = new Builder()
			.usingServer(seleniumUrl)
			.withCapabilities(browser.capabilities)
			.build();
	}

	async prepareBrowser(url: string): Promise<void> {
		this.currentUrl = url;
		await this.driver.get("about:blank");
		await this.driver.manage().window().maximize();
		await this.driver.executeScript(setupStoryviewIframe, url);
		this.viewportSize = await this.driver.executeScript(getViewportSize);
	}

	async resizeTo(size: WidthXHeightString): Promise<void> {
		this.storyviewSize = parseSize(size);
		return this.driver.executeScript(
			resizeStoryview,
			this.storyviewSize.width,
			this.storyviewSize.height
		);
	}

	async takeScreenshot(): Promise<Buffer> {
		const windowScreenshotBase64 = await this.driver.takeScreenshot();
		const windowScreenshot = Buffer.from(windowScreenshotBase64, "base64");
		const actualSize = intersect(this.storyviewSize, this.viewportSize);
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

	async close(): Promise<void> {
		await this.driver.close();
	}

	getCurrentUrl(): string {
		return this.currentUrl;
	}
}

export function createBrowser(
	seleniumUrl: string,
	browserSpecification: BrowserSpecification
): Browser {
	const browser = new BrowserImpl(seleniumUrl, browserSpecification);
	return addDebugLogAllMethods(debug, browser.id, browser);
}
