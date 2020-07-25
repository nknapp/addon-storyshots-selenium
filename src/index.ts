import webdriver, { WebDriver } from "selenium-webdriver";
import { createSnapshot } from "./createSnapshot";
import path from "path";
import {
	ImageSnapshotOptions,
	InternalImageSnapshotOptions,
	OptionalImageSnapshotOptions,
	TestMethod,
} from "./types";

import { doNothing, requireKeyInOptions, waitMillis } from "./utils";

export { doNothing, waitMillis } from "./utils";

const defaultOptions: OptionalImageSnapshotOptions = {
	sizes: ["1024x768"],
	storybookUrl: "http://localhost:6006",
	beforeFirstScreenshot: waitMillis(1000),
	beforeEachScreenshot: waitMillis(200),
	afterEachScreenshot: doNothing(),
	getMatchOptions: doNothing(),
	snapshotDirectory: path.join("src", "__image_snapshots_selenium__"),
	seleniumUrl: process.env.SELENIUM_URL || "http://localhost:4444/wd/hub",
	testTimeoutMillis: 10000,
	setupTimeoutMillis: 60000,
	teardownTimeoutMillis: 60000,
};

export function imageSnapshot(options: ImageSnapshotOptions): TestMethod {
	requireKeyInOptions(options, "browsers");
	const optionsWithDefaults: InternalImageSnapshotOptions = {
		...defaultOptions,
		...options,
	};

	interface WebdriverTarget {
		browserId: string;
		driver: WebDriver;
	}

	let webdriverTargets: WebdriverTarget[];

	async function setupSeleniumWebdriver() {
		webdriverTargets = await Promise.all(
			optionsWithDefaults.browsers.map(async (browser) => {
				return {
					browserId: browser.id,
					driver: new webdriver.Builder()
						.usingServer(optionsWithDefaults.seleniumUrl)
						.withCapabilities(browser.capabilities)
						.build(),
				};
			})
		);
	}

	async function runTest(context) {
		const storySpecificSizes = context.story.parameters?.storyshotSelenium?.sizes;
		const exceptions = [];
		await Promise.all(
			webdriverTargets.map(async ({ browserId, driver }) => {
				await createSnapshot({
					sizes: storySpecificSizes != null ? storySpecificSizes : optionsWithDefaults.sizes,
					driver,
					context,
					browserId,
					storybookUrl: optionsWithDefaults.storybookUrl,
					beforeFirstScreenshot: optionsWithDefaults.beforeFirstScreenshot,
					beforeEachScreenshot: optionsWithDefaults.beforeEachScreenshot,
					afterEachScreenshot: optionsWithDefaults.afterEachScreenshot,
					getMatchOptions: optionsWithDefaults.getMatchOptions,
					snapshotDirectory: optionsWithDefaults.snapshotDirectory,
					onError: (error) => exceptions.push(error),
				});
			})
		);
		if (exceptions.length > 0) {
			console.log(
				`Found ${exceptions.length} errors during test execution. Rethrowing the first one`
			);
			throw exceptions[0];
		}
	}

	async function closeSeleniumWebdriver() {
		if (webdriverTargets != null) {
			await Promise.all(
				webdriverTargets.map(async (webdriverTarget) => {
					try {
						await webdriverTarget.driver.quit();
					} catch (error) {
						console.error(error);
					}
				})
			);
		}
	}

	const testMethod: TestMethod = runTest;
	testMethod.timeout = optionsWithDefaults.testTimeoutMillis * optionsWithDefaults.sizes.length;

	testMethod.beforeAll = setupSeleniumWebdriver;
	testMethod.beforeAll.timeout = optionsWithDefaults.setupTimeoutMillis;

	testMethod.afterAll = closeSeleniumWebdriver;
	testMethod.afterAll.timeout = optionsWithDefaults.teardownTimeoutMillis;

	return testMethod;
}
