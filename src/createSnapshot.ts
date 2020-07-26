/* global expect */
import "trace";
import path from "path";
import { forEachSequential } from "./foreach-sequential";
import sharp from "sharp";
import { resizeStoryview, setupStoryview } from "./in-page-scripts";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import {
	AfterEachScreenshotFunction,
	BeforeScreenshotsFunction,
	GetMatchOptionsFunction,
	WidthXHeight,
} from "./types";
import { WebDriver, Key, By } from "selenium-webdriver";
import createDebug from "debug";
import { ResilientSeleniumAdapter } from "./resilient-selenium-adapter";

expect.extend({ toMatchImageSnapshot });
const debug = createDebug("addon-storyshot-selenium:createSnapshot");

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
	snapshotDirectory: string;
	onError: (error: Error) => void;
}

interface RectSize {
	width: number;
	height: number;
}

export async function createSnapshot(options: CreateSnapshotOptions): Promise<void> {
	const screenshotUrl = `${options.storybookUrl}/iframe.html?id=${encodeURIComponent(
		options.context.story.id
	)}`;

	await options.webdriverAdapter.doWithRetries(async (driver) => {
		await logError(() => driver.get("about:blank"));
		await logError(() => driver.manage().window().maximize());
		await logError(() => driver.executeScript(setupStoryview, screenshotUrl));
		const viewportSize: RectSize = await logError(() =>
			driver.executeScript("return {width: window.innerWidth, height: window.innerHeight}")
		);

		await options.beforeFirstScreenshot({
			driver: driver,
			context: options.context,
			screenshotUrl,
		});

		await forEachSequential(options.sizes, async (size) => {
			try {
				const [width, height] = size.split("x").map(Number);

				await logError(() => driver.executeScript(resizeStoryview, width, height));
				await options.beforeEachScreenshot({
					driver: driver,
					context: options.context,
					screenshotUrl,
				});

				const screenshotBase64 = await logError(() => driver.takeScreenshot());
				debug(`Taking screenshot on "${options.browserId}" for size "${size}`);
				await logError(() => driver.takeScreenshot());
				debug(`Done taking screenshot on "${options.browserId}" for size "${size}`);
				const screenshot = Buffer.from(screenshotBase64, "base64");
				await options.afterEachScreenshot({ screenshot, context: options.context });
				const croppedScreenshot = await extractStoryview(
					screenshot,
					{ height, width },
					viewportSize,
					options.browserId
				);

				const directory = path.join(options.snapshotDirectory, options.context.story.id);
				return expect(croppedScreenshot).toMatchImageSnapshot({
					customSnapshotsDir: directory,
					customSnapshotIdentifier: `${options.context.story.id}-${size}-${options.browserId}`,
					...options.getMatchOptions(options.context, screenshotUrl),
				});
			} catch (error) {
				options.onError(error);
			}
		});
	});
}

async function extractStoryview(
	screenshot: Buffer,
	requestedSize: RectSize,
	viewportSize: RectSize,
	browserId: string
) {
	try {
		const actualSize: RectSize = {
			height: Math.min(requestedSize.height, viewportSize.height),
			width: Math.min(requestedSize.width, viewportSize.width),
		};
		if (actualSize.height !== requestedSize.height || actualSize.width !== requestedSize.width) {
			console.error(
				`Viewport is smaller than requested screenshot size for browser "${browserId}`,
				{
					requestedSize,
					actualSize,
				}
			);
		}
		return await sharp(screenshot)
			.extract({
				left: 0,
				top: 0,
				width: actualSize.width,
				height: actualSize.height,
			})
			.png({ compressionLevel: 9 })
			.toBuffer();
	} catch (error) {
		throw new Error(
			`Error extracting screenshot of size ${requestedSize.width}x${requestedSize.height} for browser "${browserId}"`
		);
	}
}

async function logError<R>(fn: () => Promise<R>): Promise<R> {
	try {
		return await fn();
	} catch (error) {
		console.trace("error found", error);
		throw error;
	}
}
