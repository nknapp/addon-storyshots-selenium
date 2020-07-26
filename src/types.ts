import { RenderTree } from "@storybook/addon-storyshots/dist/frameworks/Loader";
import { MatchImageSnapshotOptions } from "jest-image-snapshot";
import { WebDriver } from "selenium-webdriver";

export interface LifeCycleMethod {
	(): Promise<void>;
	timeout?: number;
}

export interface TestMethod {
	(story: any, context: any, renderTree: RenderTree, options?: any): any;
	beforeAll?: LifeCycleMethod;
	afterAll?: LifeCycleMethod;
	timeout?: number;
}

/**
 * String of the form "1000x800"
 */
export type WidthXHeightString = string;

export interface WidthAndHeight {
	width: number;
	height: number;
}

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
	size: WidthAndHeight
) => Promise<MatchImageSnapshotOptions | void> | void;

export interface BrowserSpecification {
	id: string;
	capabilities: any;
}

export interface RequiredImageSnapshotOptions {
	browsers: BrowserSpecification[];
}

export interface OptionalImageSnapshotOptions {
	sizes: WidthXHeightString[];
	storybookUrl: string;
	seleniumUrl: string;
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

export type ImageSnapshotOptions = Partial<OptionalImageSnapshotOptions> &
	RequiredImageSnapshotOptions;

export interface StorybookContext {
	story: StorybookStory;
}

export interface StorybookStory {
	id: string;
}
