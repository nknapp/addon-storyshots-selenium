import { createSnapshot } from "./internal/createSnapshot";
import { ImageSnapshotOptions, InternalImageSnapshotOptions, TestMethod } from "./types";

import createDebug from "debug";
import { defaultOptions } from "./internal/defaultOptions";
import { createSectionDebug } from "./internal/utils/section-debug";
import { firstNonNull, requireKeyInOptions } from "./internal/utils/null-handling";
import { Browser, DebugLoggingBrowser } from "./internal/browser";
import { doNothing } from "./public-utils";

export { doNothing, waitMillis } from "./public-utils";

const sectionDebug = createSectionDebug(createDebug("addon-storyshots-selenium:index-trace"));

/**
 * Create and compare image snapshots as part of the storyshots addon. The resulting function has `beforeAll`
 * and `afterAll`-hooks attached. Althogether, the following process will be performed:
 *
 * * Setup selenium-drivers for all specified browsers
 * * For all drivers in parallel, perform the following steps:
 *   * Iterate through the stories. For each story
 *     * open the story in the browser
 *     * resize the browser to the specified window sizes
 *     * take a screenshot of the window
 *     * compare the screenshot to the baseline-version in the project.
 * * Close down all drivers.
 */
export function imageSnapshot(options: ImageSnapshotOptions): TestMethod {
	requireKeyInOptions(options, "browsers");
	const optionsWithDefaults: InternalImageSnapshotOptions = {
		...defaultOptions,
		...options,
	};

	let browsers: Browser[];

	async function setupSeleniumWebdrivers() {
		browsers = optionsWithDefaults.browsers.map(
			(browser) => new DebugLoggingBrowser(optionsWithDefaults.seleniumUrl, browser)
		);
	}

	async function closeSeleniumWebdrivers() {
		if (browsers != null) {
			await Promise.all(
				browsers.map(async (seleniumAdapter) => seleniumAdapter.close().catch(doNothing()))
			);
		}
	}

	async function runTest(context) {
		const storySpecificSizes = context.story.parameters?.storyshotSelenium?.sizes;
		const exceptions = [];
		await Promise.all(
			browsers.map(async (browser) => {
				await createSnapshot({
					sizes: firstNonNull(storySpecificSizes, optionsWithDefaults.sizes),
					browser,
					context,
					storybookUrl: optionsWithDefaults.storybookUrl,
					beforeFirstScreenshot: optionsWithDefaults.beforeFirstScreenshot,
					beforeEachScreenshot: optionsWithDefaults.beforeEachScreenshot,
					afterEachScreenshot: optionsWithDefaults.afterEachScreenshot,
					getMatchOptions: optionsWithDefaults.getMatchOptions,
					snapshotBaseDirectory: optionsWithDefaults.snapshotBaseDirectory,
					onError: (error) => exceptions.push(error),
				});
			})
		);
		if (exceptions.length > 0) {
			// eslint-disable-next-line no-console
			console.error(
				`Found ${exceptions.length} errors during test execution. Rethrowing the first one`
			);
			// eslint-disable-next-line no-console
			console.error(exceptions);
			throw exceptions[0];
		}
	}

	const testMethod: TestMethod = runTest;
	testMethod.timeout = optionsWithDefaults.testTimeoutMillis;

	testMethod.beforeAll = () => sectionDebug("setup selenium webdrivers", setupSeleniumWebdrivers);
	testMethod.beforeAll.timeout = optionsWithDefaults.setupTimeoutMillis;

	testMethod.afterAll = () => sectionDebug("close selenium webdrivers", closeSeleniumWebdrivers);
	testMethod.afterAll.timeout = optionsWithDefaults.teardownTimeoutMillis;

	return testMethod;
}
