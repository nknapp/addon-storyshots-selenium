import {
	ImageSnapshotOptions,
	InternalImageSnapshotOptions,
	TestMethod,
	TestMethodArgs,
} from "./types";

import createDebug from "debug";
import { defaultOptions, getDefaultMatchOptions } from "./internal/defaultOptions";
import { createSectionDebug } from "./internal/utils/section-debug";
import { firstNonNull, requireKeyInOptions } from "./internal/utils/null-handling";
import { Browser, createBrowser } from "./internal/browser";
import { doNothing } from "./public-utils";
import { createSnapshotter } from "./internal/snapshotter";

export { doNothing, waitMillis } from "./public-utils";

const sectionDebug = createSectionDebug(createDebug("addon-storyshots-selenium:index"));

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
		browsers = optionsWithDefaults.browsers.map((browserSpec) =>
			createBrowser(optionsWithDefaults.seleniumUrl, browserSpec)
		);
	}

	async function closeSeleniumWebdrivers() {
		if (browsers != null) {
			await Promise.all(browsers.map(async (browser) => browser.quit().catch(doNothing())));
		}
	}

	async function runTest({ context }: TestMethodArgs): Promise<void> {
		if (context.parameters?.storyshotSelenium?.ignore) {
			return;
		}

		const storySpecificSizes = context.parameters?.storyshotSelenium?.sizes;
		const snapshotter = createSnapshotter({
			beforeFirstScreenshot: optionsWithDefaults.beforeFirstScreenshot,
			beforeEachScreenshot: optionsWithDefaults.beforeEachScreenshot,
			afterEachScreenshot: optionsWithDefaults.afterEachScreenshot,
			getMatchOptions(options) {
				return {
					...getDefaultMatchOptions(optionsWithDefaults.snapshotBaseDirectory, options),
					...optionsWithDefaults.getMatchOptions(options),
				};
			},
			sizes: firstNonNull(storySpecificSizes, optionsWithDefaults.sizes),
			context,
		});
		await Promise.all(
			browsers.map(async (browser) => {
				await snapshotter.createSnapshots(browser, optionsWithDefaults.storybookUrl);
			})
		);
		const errors = snapshotter.errors;
		if (errors.length > 0) {
			// eslint-disable-next-line no-console
			console.error(
				`Found ${errors.length} errors during test execution. Rethrowing the first one`
			);
			// eslint-disable-next-line no-console
			console.error(errors);
			throw errors[0];
		}
	}

	runTest.timeout = optionsWithDefaults.testTimeoutMillis;

	const beforeAll = () => sectionDebug("setup selenium webdrivers", setupSeleniumWebdrivers);
	beforeAll.timeout = optionsWithDefaults.setupTimeoutMillis;
	runTest.beforeAll = beforeAll;

	const afterAll = () => sectionDebug("close selenium webdrivers", closeSeleniumWebdrivers);
	afterAll.timeout = optionsWithDefaults.teardownTimeoutMillis;
	runTest.afterAll = afterAll;

	return runTest;
}
