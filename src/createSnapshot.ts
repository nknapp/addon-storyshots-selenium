/* global expect */
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
import { WebDriver } from "selenium-webdriver";
expect.extend({ toMatchImageSnapshot });

interface CreateSnapshotOptions {
	sizes: WidthXHeight[];
	driver: WebDriver;
	context: any;
	browserId: string;
	beforeFirstScreenshot: BeforeScreenshotsFunction;
	beforeEachScreenshot: BeforeScreenshotsFunction;
	afterEachScreenshot: AfterEachScreenshotFunction;
	storybookUrl: string;
	getMatchOptions: GetMatchOptionsFunction;
	snapshotDirectory: string;
	onError: (error: Error) => void;
}

export async function createSnapshot(options: CreateSnapshotOptions): Promise<void> {
	const screenshotUrl = `${options.storybookUrl}/iframe.html?id=${encodeURIComponent(
		options.context.story.id
	)}`;

	await options.driver.get("about:blank");
	await options.driver.manage().window().maximize();
	await options.driver.executeScript(setupStoryview, screenshotUrl);

	await options.beforeFirstScreenshot({
		driver: options.driver,
		context: options.context,
		screenshotUrl,
	});

	await forEachSequential(options.sizes, async (size) => {
		const [width, height] = size.split("x").map(Number);

		await options.driver.executeScript(resizeStoryview, width, height);
		await options.beforeEachScreenshot({
			driver: options.driver,
			context: options.context,
			screenshotUrl,
		});
		const screenshotBase64 = await options.driver.takeScreenshot();
		const screenshot = Buffer.from(screenshotBase64, "base64");
		await options.afterEachScreenshot({ screenshot, context: options.context });
		const croppedScreenshot = await sharp(screenshot)
			.extract({
				left: 0,
				top: 0,
				height: height + 2,
				width: width + 2,
			})
			.png({ compressionLevel: 9 })
			.toBuffer();

		const directory = path.join(options.snapshotDirectory, options.context.story.id);
		try {
			return expect(croppedScreenshot).toMatchImageSnapshot({
				customSnapshotsDir: directory,
				customSnapshotIdentifier: `${options.context.story.id}-${size}-${options.browserId}`,
				...options.getMatchOptions(options.context, screenshotUrl),
			});
		} catch (error) {
			options.onError(error);
		}
	});
}
