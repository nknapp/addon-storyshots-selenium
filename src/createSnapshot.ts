/* global expect */
import path from "path";
import { forEachSequential } from "./foreach-sequential";
import sharp from "sharp";
import { getViewportSize, resizeStoryview, setupStoryview } from "./in-page-scripts";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import {
	AfterEachScreenshotFunction,
	BeforeScreenshotsFunction,
	GetMatchOptionsFunction,
	WidthXHeight,
} from "./types";
import createDebug from "debug";
import { ResilientSeleniumAdapter } from "./resilient-selenium-adapter";
import { createSectionDebug } from "./utils/internal-utils";
import { Extent, extent, extentFromSizeString } from "./utils/extent";
import { WebDriver } from "selenium-webdriver";

expect.extend({ toMatchImageSnapshot });
const sectionDebug = createSectionDebug(
	createDebug("addon-storyshots-selenium:createSnapshot-trace")
);

interface CreateSnapshotOptions {
	sizes: WidthXHeight[];
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

export async function createSnapshot({
	afterEachScreenshot,
	beforeEachScreenshot,
	beforeFirstScreenshot,
	browserId,
	context,
	getMatchOptions,
	onError,
	sizes,
	snapshotBaseDirectory,
	storybookUrl,
	webdriverAdapter,
}: CreateSnapshotOptions): Promise<void> {
	const screenshotUrl = `${storybookUrl}/iframe.html?id=${encodeURIComponent(context.story.id)}`;

	async function setupBrowserPage(driver: WebDriver) {
		await withLog("setup blank page", () => driver.get("about:blank"));
		await withLog("maximise browser window", () => driver.manage().window().maximize());
		await withLog("setupStoryView", () => driver.executeScript(setupStoryview, screenshotUrl));
	}

	function withLog<T>(section: string, fn: () => T): T {
		return sectionDebug(`${section} for browser "${browserId}`, fn);
	}

	async function extractStoryViewFromScreenshot(screenshot: Buffer, { width, height }) {
		try {
			return await sharp(screenshot)
				.extract({ left: 0, top: 0, width, height })
				.png({ compressionLevel: 9 })
				.toBuffer();
		} catch (error) {
			throw new Error(
				`Error extracting screenshot of size ${width}x${height} for browser "${browserId}"`
			);
		}
	}

	function computeActualSize(requestedSize: Extent, viewportSize: Extent) {
		if (requestedSize.liesWithin(viewportSize)) {
			return requestedSize;
		}
		console.error(`Viewport is smaller than requested screenshot size for browser "${browserId}`, {
			viewportSize,
			requestedSize,
		});
		return requestedSize.intersection(viewportSize);
	}

	async function takeScreenshot(driver: WebDriver, requestedSize: Extent, viewportSize: Extent) {
		const screenshotBase64 = await withLog("take screenshot", () => driver.takeScreenshot());
		const screenshot = Buffer.from(screenshotBase64, "base64");
		const storyViewSize = computeActualSize(requestedSize, viewportSize);

		return extractStoryViewFromScreenshot(screenshot, storyViewSize);
	}
	await webdriverAdapter.doWithRetries(async (driver) => {
		await setupBrowserPage(driver);
		const viewportSize = await withLog("get viewport size", async () => {
			return extent(await driver.executeScript(getViewportSize));
		});

		await withLog("beforeFirstScreenshot", () =>
			beforeFirstScreenshot({ driver, context, screenshotUrl })
		);

		await forEachSequential(sizes, async (size) => {
			try {
				const requestedSize = extentFromSizeString(size);

				await withLog(`resize storyView to ${size}`, () =>
					driver.executeScript(resizeStoryview, requestedSize.width, requestedSize.height)
				);
				await withLog("beforeEachScreenshot", () =>
					beforeEachScreenshot({ driver, context, screenshotUrl })
				);
				const screenshot = await takeScreenshot(driver, requestedSize, viewportSize);

				await afterEachScreenshot({ screenshot, context: context });
				const directory = path.join(snapshotBaseDirectory, context.story.id);
				return expect(screenshot).toMatchImageSnapshot({
					customSnapshotsDir: directory,
					customSnapshotIdentifier: `${context.story.id}-${size}-${browserId}`,
					...getMatchOptions(context, screenshotUrl),
				});
			} catch (error) {
				onError(error);
			}
		});
	});
}
