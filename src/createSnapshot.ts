/* global expect */
import sharp from "sharp";
import { WebDriver } from "selenium-webdriver";
import createDebug from "debug";
import { toMatchImageSnapshot } from "jest-image-snapshot";

import { forEachSequential } from "./foreach-sequential";
import {
	AfterEachScreenshotFunction,
	BeforeScreenshotsFunction,
	GetMatchOptionsFunction,
	WidthXHeightString,
} from "./types";
import { ResilientSeleniumAdapter } from "./resilient-selenium-adapter";
import { computeScreenshotUrl, createSectionDebug } from "./utils/internal-utils";
import { Extent } from "./utils/extent";
import { getDefaultMatchOptions } from "./defaultOptions";
import { WebDriverActions } from "./utils/webdriver-actions";

expect.extend({ toMatchImageSnapshot });
const sectionDebug = createSectionDebug(
	createDebug("addon-storyshots-selenium:createSnapshot-trace")
);

interface CreateSnapshotOptions {
	sizes: WidthXHeightString[];
	browserId: string;
	webdriverAdapter: ResilientSeleniumAdapter;
	context: any;
	beforeFirstScreenshot: BeforeScreenshotsFunction;
	beforeEachScreenshot: BeforeScreenshotsFunction;
	afterEachScreenshot: AfterEachScreenshotFunction;
	storybookUrl: string;
	getMatchOptions: GetMatchOptionsFunction;
	snapshotBaseDirectory: string;
	onError: (error: Error) => void;
}

export async function createSnapshot(options: CreateSnapshotOptions): Promise<void> {
	const Photographer = createPhotographerClass(options);
	await options.webdriverAdapter.doWithRetries(async (driver) => {
		const photographer = new Photographer(driver);
		await photographer.compareSizedSnapshots();
	});
}

function createPhotographerClass({
	beforeEachScreenshot,
	beforeFirstScreenshot,
	afterEachScreenshot,
	browserId,
	context,
	getMatchOptions,
	onError,
	sizes,
	snapshotBaseDirectory,
	storybookUrl,
}: CreateSnapshotOptions) {
	return class {
		private readonly screenshotUrl: string;
		private readonly webdriverActions: WebDriverActions;
		private readonly driver: WebDriver;
		private readonly requestedSizes: Extent[];

		private viewportSize: Extent;

		constructor(driver: WebDriver) {
			this.webdriverActions = new WebDriverActions(driver, browserId);
			this.driver = driver;

			this.screenshotUrl = computeScreenshotUrl(storybookUrl, context);
			this.requestedSizes = sizes.map(Extent.fromSizeString);
		}

		async compareSizedSnapshots(): Promise<void> {
			await this.webdriverActions.setupBlankPage();
			await this.webdriverActions.maximiseBrowserWindow();
			await this.webdriverActions.setupStoryviewIframe(this.screenshotUrl);
			this.viewportSize = await this.webdriverActions.getViewportSize();

			await this.beforeFirstScreenshot();

			await forEachSequential(this.requestedSizes, async (size) => {
				try {
					return this.compareScreenshotOfSize(size);
				} catch (error) {
					onError(error);
				}
			});
		}

		async beforeFirstScreenshot() {
			const driver = this.driver;
			const screenshotUrl = this.screenshotUrl;
			await this.withLog("beforeFirstScreenshot", () =>
				beforeFirstScreenshot({ driver, context, screenshotUrl })
			);
		}

		private async compareScreenshotOfSize(size: Extent): Promise<void> {
			await this.webdriverActions.resizeStoryviewIframeTo(size);
			await this.callBeforeEachScreenshotHook();
			const screenshot = await this.takeScreenshotOfStoryViewIframe(size);
			await this.callAfterEachScreenshotHook(screenshot);
			try {
				return await expect(screenshot).toMatchImageSnapshot({
					...getDefaultMatchOptions(snapshotBaseDirectory, context, size, browserId),
					...(await getMatchOptions(context, this.screenshotUrl, size)),
				});
			} catch (error) {
				throw new error.constructor(`For "${this.screenshotUrl}": ${error.message}`);
			}
		}

		private async callBeforeEachScreenshotHook() {
			await this.withLog("beforeEachScreenshot", () =>
				beforeEachScreenshot({
					driver: this.driver,
					context: context,
					screenshotUrl: this.screenshotUrl,
				})
			);
		}

		private async takeScreenshotOfStoryViewIframe(size: Extent): Promise<Buffer> {
			const windowScreenshotBase64 = await this.webdriverActions.takeScreenshot();
			const windowScreenshot = Buffer.from(windowScreenshotBase64, "base64");
			const storyViewSize = this.computeActualSize(size, this.viewportSize);
			return this.extractStoryViewFromScreenshot(windowScreenshot, storyViewSize);
		}

		private computeActualSize(requestedSize: Extent, viewportSize: Extent): Extent {
			if (requestedSize.liesWithin(viewportSize)) {
				return requestedSize;
			}
			return requestedSize.intersection(viewportSize);
		}

		private async extractStoryViewFromScreenshot(screenshot: Buffer, { width, height }) {
			try {
				return await this.cropScreenshot(screenshot, width, height);
			} catch (error) {
				throw new Error(
					`Error extracting screenshot of size ${width}x${height} for browser "${browserId}"`
				);
			}
		}

		private async callAfterEachScreenshotHook(screenshot) {
			await this.withLog("afterEachScreenshot", () => afterEachScreenshot({ screenshot, context }));
		}

		private cropScreenshot(screenshot: Buffer, width, height) {
			return sharp(screenshot)
				.extract({ left: 0, top: 0, width, height })
				.png({ compressionLevel: 9 })
				.toBuffer();
		}

		private withLog<T>(section: string, fn: () => T): T {
			return sectionDebug(`${section} for browser "${browserId}`, fn);
		}
	};
}
