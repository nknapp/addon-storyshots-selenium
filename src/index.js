import webdriver from "selenium-webdriver";
import { createSnapshot } from "./createSnapshot";
import { forEachSequential } from "./foreach-sequential";
import path from "path";

/**
 *
 * @param {object} options
 * @param {string[]=} options.sizes a list of sizes (i.e. ['1280x1024','1024x768']) to use for the screenshots. Default: 1024x768)
 * @param {object[]} options.browsers a list of selenium browser definition (caps)
 * @param {string=} options.storybookUrl the where to reach storybook from the browser's point-of-view. Default: 'http://localhost:6006'
 * @param {string=} options.seleniumHost the hostname of the selenium server
 * @param {function(session, context, url):Promise<void>=} options.beforeScreenshot a function that is executed before taking a screenshot
 * @param {function(image, context):Promise<void>=} options.afterScreenshot a function that is executed after taking a screenshot
 * @param {function(context, url): object=} options.getMatchOptions a function that returns options for [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot#%EF%B8%8F-api)
 * @return {function}
 */
export function imageSnapshot(options) {
	requireKeyInOptions(options, "browsers");
	const optionsWithDefaults = {
		sizes: ["1024x768"],
		storybookUrl: "http://localhost:6006",
		beforeScreenshot: () => {},
		afterScreenshot: () => {},
		getMatchOptions: () => {},
		snapshotDirectory: path.join("src", "__image_snapshots_selenium__"),
		seleniumHost: process.env.SELENIUM_HOST || "localhost",
		...options,
	};

	let webdriverTargets;

	async function testMethod(context) {
		return runTest(context);
	}

	testMethod.beforeAll = async () => {
		webdriverTargets = await Promise.all(
			optionsWithDefaults.browsers.map(async (browser) => {
				return {
					browserId: browser.id,
					driver: new webdriver.Builder()
						.usingServer("http://localhost:24444/wd/hub")
						.withCapabilities(browser.capabilities)
						.build(),
				};
			})
		);
	};

	testMethod.beforeAll.timeout = 60000;

	async function runTest(context) {
		await Promise.all(
			webdriverTargets.map(async ({ browserId, driver }) => {
				await forEachSequential(optionsWithDefaults.sizes, async (size) => {
					await createSnapshot({
						size,
						driver,
						context,
						browserId,
						storybookUrl: optionsWithDefaults.storybookUrl,
						beforeScreenshot: optionsWithDefaults.beforeScreenshot,
						afterScreenshot: optionsWithDefaults.afterScreenshot,
						getMatchOptions: optionsWithDefaults.getMatchOptions,
						snapshotDirectory: optionsWithDefaults.snapshotDirectory,
					});
				});
			})
		);
	}

	testMethod.afterAll = async () => {
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
	};
	testMethod.timeout = 10000;

	return testMethod;
}

function requireKeyInOptions(object, key) {
	if (object[key] == null) {
		throw new Error(`Key "${key}" is required but not found in options`);
	}
}
