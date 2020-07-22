/* global expect */
import path from "path";
const { toMatchImageSnapshot } = require("jest-image-snapshot");
expect.extend({ toMatchImageSnapshot });

export async function createSnapshot({
	size,
	driver,
	context,
	browserId,
	beforeScreenshot,
	afterScreenshot,
	storybookUrl,
	getMatchOptions,
	snapshotDirectory,
}) {
	const [width, height] = size.split("x").map(Number);

	await driver.manage().window().setRect({ width, height });

	const screenshotUrl = `${storybookUrl}/iframe.html?id=${encodeURIComponent(
		context.story.id
	)}&${size}`;
	await driver.get(screenshotUrl);

	await beforeScreenshot(driver, context, screenshotUrl);
	const screenshotData = await driver.takeScreenshot();
	await afterScreenshot({ image: screenshotData, context });

	const screenshotBinary = Buffer.from(screenshotData, "base64");
	const directory = path.join(snapshotDirectory, context.story.id);
	return expect(screenshotBinary).toMatchImageSnapshot({
		customSnapshotsDir: directory,
		customSnapshotIdentifier: `${context.story.id}-${size}-${browserId}`,
		...getMatchOptions(context, screenshotUrl),
	});
}
