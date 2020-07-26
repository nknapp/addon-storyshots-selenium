import webdriver, { WebDriver } from "selenium-webdriver";
import { createSnapshot } from "./createSnapshot";
import path from "path";
import {
	BrowserSpecification,
	ImageSnapshotOptions,
	InternalImageSnapshotOptions,
	OptionalImageSnapshotOptions,
	TestMethod,
} from "./types";

import { doNothing, requireKeyInOptions, waitMillis } from "./utils";
import createDebug from "debug";
import { ResilientSeleniumAdapter } from "./resilient-selenium-adapter";

export { doNothing, waitMillis } from "./utils";

const debug = createDebug("addon-storyshot-selenium:index");

const defaultOptions: OptionalImageSnapshotOptions = {
	sizes: ["1024x768"],
	storybookUrl: "http://localhost:6006",
	beforeFirstScreenshot: waitMillis(1000),
	beforeEachScreenshot: waitMillis(200),
	afterEachScreenshot: doNothing(),
	getMatchOptions: doNothing(),
	snapshotDirectory: path.join("src", "__image_snapshots_selenium__"),
	seleniumUrl: process.env.SELENIUM_URL || "http://localhost:4444/wd/hub",
	testTimeoutMillis: 60000,
	setupTimeoutMillis: 60000,
	teardownTimeoutMillis: 60000,
};

export function imageSnapshot(options: ImageSnapshotOptions): TestMethod {
	requireKeyInOptions(options, "browsers");
	const optionsWithDefaults: InternalImageSnapshotOptions = {
		...defaultOptions,
		...options,
	};

	let webdriverAdapters: ResilientSeleniumAdapter[];

	async function setupSeleniumWebdriver() {
		debug("setup");
		webdriverAdapters = optionsWithDefaults.browsers.map(
			(browser) => new ResilientSeleniumAdapter(optionsWithDefaults.seleniumUrl, browser)
		);
	}

	async function closeSeleniumWebdriver() {
		debug("close");
		if (webdriverAdapters != null) {
			await Promise.all(
				webdriverAdapters.map(async (seleniumAdapter) => {
					try {
						debug(`shutting down browser ${seleniumAdapter.browserId}`);
						await seleniumAdapter.close();
						debug(`done shutting down browser ${seleniumAdapter.browserId}`);
					} catch (error) {
						console.error(`error shutting down browser ${seleniumAdapter.browserId}`, error);
					}
				})
			);
		}
	}

	async function runTest(context) {
		const storySpecificSizes = context.story.parameters?.storyshotSelenium?.sizes;
		const exceptions = [];
		await Promise.all(
			webdriverAdapters.map(async (webdriverAdapter) => {
				await createSnapshot({
					sizes: storySpecificSizes != null ? storySpecificSizes : optionsWithDefaults.sizes,
					browserId: webdriverAdapter.browserId,
					webdriverAdapter,
					context,
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
			console.error(
				`Found ${exceptions.length} errors during test execution. Rethrowing the first one`
			);
			console.error(exceptions);
			throw exceptions[0];
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
