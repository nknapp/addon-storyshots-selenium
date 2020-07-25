import { RenderTree } from "@storybook/addon-storyshots/dist/frameworks/Loader";
import { MatchImageSnapshotOptions } from "jest-image-snapshot";
import { ICapability } from "selenium-webdriver/lib/capabilities";

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
export type WidthXHeight = string;

export type BeforeScreenshotsFunction = ({
	driver: WebDriver,
	context: any,
	screenshotUrl: string,
}) => Promise<void>;

export type AfterEachScreenshotFunction = ({ screenshot: Buffer, context: any }) => Promise<void>;

export type GetMatchOptionsFunction = (
	context: any,
	screenshotUrl: string
) => Promise<MatchImageSnapshotOptions | void> | void;

export interface BrowserSpecification {
	id: string;
	capabilities: any;
}

export interface RequiredImageSnapshotOptions {
	browsers: BrowserSpecification[];
}

export interface OptionalImageSnapshotOptions {
	sizes: WidthXHeight[];
	storybookUrl: string;
	seleniumUrl: string;
	testTimeoutMillis: number;
	setupTimeoutMillis: number;
	teardownTimeoutMillis: number;
	beforeFirstScreenshot: BeforeScreenshotsFunction;
	beforeEachScreenshot: BeforeScreenshotsFunction;
	afterEachScreenshot: AfterEachScreenshotFunction;
	getMatchOptions: GetMatchOptionsFunction;
	snapshotDirectory: string;
}

export type InternalImageSnapshotOptions = OptionalImageSnapshotOptions &
	RequiredImageSnapshotOptions;

export type ImageSnapshotOptions = Partial<OptionalImageSnapshotOptions> &
	RequiredImageSnapshotOptions;
