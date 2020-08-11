/* global expect */
import createDebug from "debug";
import { toMatchImageSnapshot } from "jest-image-snapshot";

import { forEachSequential } from "./foreach-sequential";
import {
	AfterEachScreenshotFunction,
	BeforeScreenshotsFunction,
	GetMatchOptionsFunction,
	WidthXHeightString,
} from "../types";
import { createSectionDebug } from "./section-debug";
import { getDefaultMatchOptions } from "./defaultOptions";
import { Browser } from "./browser";

expect.extend({ toMatchImageSnapshot });
const sectionDebug = createSectionDebug(createDebug("addon-storyshots-selenium:createSnapshot"));

interface CreateSnapshotOptions {
	sizes: WidthXHeightString[];
	browser: Browser;
	context: any;
	beforeFirstScreenshot: BeforeScreenshotsFunction;
	beforeEachScreenshot: BeforeScreenshotsFunction;
	afterEachScreenshot: AfterEachScreenshotFunction;
	storybookUrl: string;
	getMatchOptions: GetMatchOptionsFunction;
	snapshotBaseDirectory: string;
	onError: (error: Error) => void;
}

export async function createSnapshot({
	afterEachScreenshot,
	beforeEachScreenshot,
	beforeFirstScreenshot,
	context,
	getMatchOptions,
	onError,
	sizes,
	snapshotBaseDirectory,
	storybookUrl,
	browser,
}: CreateSnapshotOptions): Promise<void> {
	const screenshotUrl = `${storybookUrl}/iframe.html?id=${encodeURIComponent(context.story.id)}`;

	await sectionDebug(`compare snapshots for  ${screenshotUrl} in ${browser.id}`, () =>
		compareAllSizes(browser)
	);

	async function compareAllSizes(browser: Browser): Promise<void> {
		await browser.prepareBrowser(screenshotUrl);
		await browser.callHook(beforeFirstScreenshot, { context, screenshotUrl });
		await forEachSequential(sizes, async (size) => {
			try {
				const screenshot = await takeScreenshot(browser, size);
				await expect(screenshot).toMatchImageSnapshot({
					...getDefaultMatchOptions(snapshotBaseDirectory, context, size, browser.id),
					...(await getMatchOptions(context, screenshotUrl, size)),
				});
			} catch (error) {
				onError(error);
			}
		});
	}

	async function takeScreenshot(browser: Browser, size: WidthXHeightString): Promise<Buffer> {
		await browser.resizeTo(size);

		await browser.callHook(beforeEachScreenshot, { context, screenshotUrl });
		const screenshot = await browser.takeScreenshot();
		await afterEachScreenshot({ screenshot, context });

		return screenshot;
	}
}
