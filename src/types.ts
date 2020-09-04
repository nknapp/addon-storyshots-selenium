import { MatchImageSnapshotOptions } from "jest-image-snapshot";
import { WebDriver } from "selenium-webdriver";

/**
 * The result-type of the "imageSnapshot" method.
 */
export interface TestMethod {
	(args: TestMethodArgs): any;
	beforeAll: LifeCycleMethod;
	afterAll: LifeCycleMethod;
	timeout: number;
}

/**
 * beforeAll and afterAll methods of result-type
 */
export interface LifeCycleMethod {
	(): Promise<void>;
	timeout: number;
}

/**
 * String of the form "1000x800"
 */
export type WidthXHeightString = string;

export interface BasicHookOptions {
	context: TestMethodContext;
	url: string;
	browserId: string;
}

export type BeforeFirstScreenshotFunction = (
	driver: WebDriver,
	options: BasicHookOptions
) => Promise<void>;

export interface WithSize {
	size: WidthXHeightString;
}

export type BeforeEachScreenshotFunction = (
	driver: WebDriver,
	options: BasicHookOptions & WithSize
) => Promise<void>;

export interface WithImage {
	image: Buffer;
}

export type AfterEachScreenshotFunction = (
	options: BasicHookOptions & WithImage & WithSize
) => Promise<void>;

export type GetMatchOptionsOptions = BasicHookOptions & WithSize;

export type GetMatchOptionsFunction = (
	options: GetMatchOptionsOptions
) => Promise<Partial<MatchImageSnapshotOptions>> | Partial<MatchImageSnapshotOptions>;

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
	beforeFirstScreenshot: BeforeFirstScreenshotFunction;
	beforeEachScreenshot: BeforeEachScreenshotFunction;
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

export interface TestMethodArgs {
	context: TestMethodContext;
}

export interface TestMethodContext {
	id: string;
	kind: string;
	name: string;
	story: string;
	fileName: string;
	parameters?: {
		storyshotSelenium?: StoryParameters;
	};
	framework: string;
}

export interface StoryParameters {
	ignore?: boolean;
	sizes?: WidthXHeightString[];
}
