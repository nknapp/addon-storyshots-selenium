import { MatchImageSnapshotOptions } from "jest-image-snapshot";
import { WebDriver } from "selenium-webdriver";

export interface LifeCycleMethod {
	(): Promise<void>;
	timeout?: number;
}

/**
 * The result-type of the "imageSnapshot" method.
 */
export interface TestMethod {
	(story: any, context: any): any;
	beforeAll?: LifeCycleMethod;
	afterAll?: LifeCycleMethod;
	timeout?: number;
}

/**
 * String of the form "1000x800"
 */
export type WidthXHeightString = string;

interface BeforeScreenshotsOptions {
	driver: WebDriver;
	context: StorybookContext | any;
	screenshotUrl: string;
}

export type BeforeScreenshotsFunction = (options: BeforeScreenshotsOptions) => Promise<void>;

interface AfterEachScreenshotOptions {
	context: StorybookContext | any;
	screenshot: Buffer;
}

export type AfterEachScreenshotFunction = (options: AfterEachScreenshotOptions) => Promise<void>;

export type GetMatchOptionsFunction = (
	context: StorybookContext | any,
	screenshotUrl: string,
	size: WidthXHeightString
) => void | Promise<MatchImageSnapshotOptions | void>;

export interface BrowserSpecification {
	id: string;
	capabilities: any;
}

export interface RequiredImageSnapshotOptions {
	browsers: BrowserSpecification[];
}

export interface OptionalImageSnapshotOptions {
	/**
	 * A list of screen sizes to take screenshots in.
	 */
	sizes: WidthXHeightString[];

	/**
	 * URL to the storybook server (which is not started by this module)
	 */
	storybookUrl: string;

	/**
	 * URL to the selenium server
	 */
	seleniumUrl: string;

	/**
	 * Timeout
	 */
	testTimeoutMillis: number;
	setupTimeoutMillis: number;
	teardownTimeoutMillis: number;
	beforeFirstScreenshot: BeforeScreenshotsFunction;
	beforeEachScreenshot: BeforeScreenshotsFunction;
	afterEachScreenshot: AfterEachScreenshotFunction;
	getMatchOptions: GetMatchOptionsFunction;
	snapshotBaseDirectory: string;
}

export type InternalImageSnapshotOptions = OptionalImageSnapshotOptions &
	RequiredImageSnapshotOptions;

/**
 * @Public
 */
export type ImageSnapshotOptions = Partial<OptionalImageSnapshotOptions> &
	RequiredImageSnapshotOptions;

export interface StorybookContext {
	story: StorybookStory;
}

export interface StorybookStory {
	id: string;
}
