/* global expect */
import path from "path";
import { forEachSequential } from "./foreach-sequential";
import sharp from "sharp";
import { resizeStoryview, setupStoryview } from "./in-page-scripts";

const { toMatchImageSnapshot } = require("jest-image-snapshot");
expect.extend({ toMatchImageSnapshot });

export async function createSnapshot({
	sizes,
	driver,
	context,
	browserId,
	beforeScreenshot,
	afterScreenshot,
	storybookUrl,
	getMatchOptions,
	snapshotDirectory,
	onError,
}) {
	const screenshotUrl = `${storybookUrl}/iframe.html?id=${encodeURIComponent(context.story.id)}`;

	await driver.get("about:blank");
	await driver.manage().window().maximize();
	await driver.executeScript(setupStoryview, screenshotUrl);

	await beforeScreenshot(driver, context, screenshotUrl);

	await forEachSequential(sizes, async (size) => {
		const [width, height] = size.split("x").map(Number);

		await driver.executeScript(resizeStoryview, width, height);

		await delay(context.story.storyshotSelenium?.beforeScreenshotDelay || 200);
		const screenshotBase64 = await driver.takeScreenshot();

		await afterScreenshot({ image: screenshotBase64, context });
		const screenshot = Buffer.from(screenshotBase64, "base64");

		const croppedScreenshot = await sharp(screenshot)
			.extract({
				left: 0,
				top: 0,
				height: height + 2,
				width: width + 2,
			})
			.png()
			.toBuffer("DEFLATE");

		const directory = path.join(snapshotDirectory, context.story.id);
		try {
			return expect(croppedScreenshot).toMatchImageSnapshot({
				customSnapshotsDir: directory,
				customSnapshotIdentifier: `${context.story.id}-${size}-${browserId}`,
				...getMatchOptions(context, screenshotUrl),
			});
		} catch (error) {
			onError(error);
		}
	});
}

function delay(millis) {
	return new Promise((resolve) => setTimeout(resolve, millis));
}
