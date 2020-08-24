import {
	AfterEachScreenshotFunction,
	BasicHookOptions,
	BeforeEachScreenshotFunction,
	BeforeFirstScreenshotFunction,
	GetMatchOptionsFunction,
	StorybookContext,
	WidthXHeightString,
	WithSize,
} from "../types";
import { Browser } from "./browser";
import { forEachSequential } from "./utils/foreach-sequential";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import createDebug from "debug";
import { createSectionDebug } from "./utils/section-debug";

const debug = createDebug("addon-storyshots-selenium:snapshotter");
const sectionDebug = createSectionDebug(debug);

expect.extend({ toMatchImageSnapshot });

export interface SnapshotterOptions {
	sizes: WidthXHeightString[];
	beforeFirstScreenshot: BeforeFirstScreenshotFunction;
	beforeEachScreenshot: BeforeEachScreenshotFunction;
	afterEachScreenshot: AfterEachScreenshotFunction;
	getMatchOptions: GetMatchOptionsFunction;
	context: StorybookContext;
}

export interface Snapshotter {
	readonly errors: Error[];
	createSnapshots(browser: Browser, storybookUrl: string): Promise<void>;
}

export function createSnapshotter(options: SnapshotterOptions): Snapshotter {
	const snapshotterImpl = new SnapshotterImpl(options);
	if (debug.enabled) {
		return {
			createSnapshots(browser: Browser, storybookUrl: string): Promise<void> {
				return sectionDebug(browser.id, () =>
					snapshotterImpl.createSnapshots(browser, storybookUrl)
				);
			},
			errors: snapshotterImpl.errors,
		};
	}
	return snapshotterImpl;
}

class SnapshotterImpl implements Snapshotter {
	private readonly context: StorybookContext;
	private readonly sizes: WidthXHeightString[];
	private readonly beforeFirstScreenshot: BeforeFirstScreenshotFunction;
	private readonly beforeEachScreenshot: BeforeEachScreenshotFunction;
	private readonly afterEachScreenshot: AfterEachScreenshotFunction;
	private readonly getMatchOptions: GetMatchOptionsFunction;
	public readonly errors: Error[];

	constructor(options: SnapshotterOptions) {
		this.errors = [];
		this.beforeEachScreenshot = options.beforeEachScreenshot;
		this.beforeFirstScreenshot = options.beforeFirstScreenshot;
		this.afterEachScreenshot = options.afterEachScreenshot;
		this.context = options.context;
		this.sizes = options.sizes;
		this.getMatchOptions = options.getMatchOptions;
	}

	async createSnapshots(browser: Browser, storybookUrl: string): Promise<void> {
		const screenshotUrl = `${storybookUrl}/iframe.html?id=${encodeURIComponent(
			this.context.story.id
		)}`;
		await browser.prepareBrowser(screenshotUrl);

		const contextWithUrl = { context: this.context, url: screenshotUrl, browserId: browser.id };
		await this.beforeFirstScreenshot(browser.driver, contextWithUrl);
		await forEachSequential(this.sizes, async (size) => {
			try {
				const hookOptions = {
					context: this.context,
					url: browser.getCurrentUrl(),
					size,
					browserId: browser.id,
				};
				const screenshot = await this.takeScreenshot(browser, hookOptions);
				await expect(screenshot).toMatchImageSnapshot(await this.getMatchOptions(hookOptions));
			} catch (error) {
				this.errors.push(error);
			}
		});
	}

	private async takeScreenshot(
		browser: Browser,
		hookOptions: BasicHookOptions & WithSize
	): Promise<Buffer> {
		await browser.resizeTo(hookOptions.size);

		await this.beforeEachScreenshot(browser.driver, hookOptions);
		const image = await browser.takeScreenshot();
		await this.afterEachScreenshot({ ...hookOptions, image });

		return image;
	}
}
