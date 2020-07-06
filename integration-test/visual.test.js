import initStoryshots from "@storybook/addon-storyshots";
import { reverseTunnel } from "./test-utils/reverse-tunnel";
const { toMatchImageSnapshot } = require("jest-image-snapshot");
expect.extend({ toMatchImageSnapshot });

import path from "path";

import WebDriver from "webdriver";

// Storybook must already be running on port 9009

const sizes = ["1280x1024", "1024x768", "800x600", "320x640"];

const browsers = [
	{
		id: "chrome",
		capabilities: {
			browserName: "chrome",
		},
	},
	{
		id: "firefox",
		capabilities: {
			browserName: "firefox",
		},
	},
];

let webdriverTargets;

beforeAll(async () => {
	await reverseTunnel.start();

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
}, 60000);

afterAll(async () => {
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
	await reverseTunnel.stop().catch(console.error);
});

sizes.forEach((size) => {
	describe("For window size " + size, () => {
		let testMethod = async ({ story }) => {
			await Promise.all(
				webdriverTargets.map(async ({ browserId, session }) => {
					const [width, height] = size.split("x").map(Number);
					await session.setWindowRect(0, 0, width, height);
					await session.navigateTo(
						`http://localhost:9009/iframe.html?id=${encodeURIComponent(story.id)}`
					);
					const screenshotData = await session.takeScreenshot();
					const screenshotBinary = Buffer.from(screenshotData, "base64");
					const directory = path.join("__image_snapshots_selenium__", story.id);
					expect(screenshotBinary).toMatchImageSnapshot({
						customSnapshotsDir: directory,
						customSnapshotIdentifier: `${story.id}-${size}-${browserId}`,
					});
				})
			);
		};
		testMethod.timeout = 10000;

		initStoryshots({
			framework: "html",
			suite: "All",
			test: testMethod,
		});
	});
});
