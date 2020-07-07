/* global expect */
import WebDriver from "webdriver";
import path from "path";
const { toMatchImageSnapshot } = require("jest-image-snapshot");
expect.extend({ toMatchImageSnapshot });

export function imageSnapshot({ sizes, browsers, host, port }) {
	let webdriverTargets;

	async function testMethod({ story }) {
		await Promise.all(
			webdriverTargets.map(async ({ browserId, session }) => {
				for (let i = 0; i < sizes.length; i++) {
					const size = sizes[i];
					await createSnapshot(size, session, story, browserId);
				}
			})
		);
	}

	async function createSnapshot(size, session, story, browserId) {
		const [width, height] = size.split("x").map(Number);
		await session.setWindowRect(0, 0, width, height);
		await session.navigateTo(
			`http://${host}:${port}/iframe.html?id=${encodeURIComponent(story.id)}`
		);
		const screenshotData = await session.takeScreenshot();
		const screenshotBinary = Buffer.from(screenshotData, "base64");
		const directory = path.join("src", "__image_snapshots_selenium__", story.id);
		return expect(screenshotBinary).toMatchImageSnapshot({
			customSnapshotsDir: directory,
			customSnapshotIdentifier: `${story.id}-${size}-${browserId}`,
		});
	}

	testMethod.beforeAll = async () => {
		webdriverTargets = await Promise.all(
			browsers.map(async (browser) => {
				return {
					browserId: browser.id,
					session: await WebDriver.newSession({
						hostname: process.env.SELENIUM_HOST || "localhost",
						port: 24444,
						path: "/wd/hub",
						capabilities: browser.capabilities,
					}),
				};
			})
		);
	};

	testMethod.beforeAll.timeout = 60000;

	testMethod.afterAll = async () => {
		if (webdriverTargets != null) {
			await Promise.all(
				webdriverTargets.map(async (webdriverTarget) => {
					try {
						webdriverTarget.session.deleteSession();
					} catch (error) {
						console.error(error);
					}
				})
			);
		}
	};
	testMethod.timeout = 10000;

	return testMethod;
}
