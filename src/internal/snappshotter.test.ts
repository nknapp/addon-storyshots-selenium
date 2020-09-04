import { createSnapshotter, SnapshotterOptions } from "./snapshotter";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { Browser } from "./browser";
import { WebDriver } from "selenium-webdriver";
import { BasicHookOptions, WidthXHeightString } from "../types";
import createDebug from "debug";
import { willBeInitialized } from "./test-utils/will-be-initialized";

jest.mock("jest-image-snapshot", () => {
	return {
		toMatchImageSnapshot: jest.fn(),
	};
});

const toMatchImageSnapshotMock = toMatchImageSnapshot as jest.MockedFunction<
	typeof toMatchImageSnapshot
>;

const context = {
	id: "test-story",
	kind: "kind",
	story: "A story",
	name: "Story name",
	framework: "html",
	fileName: "test.js",
};

const snapshotterOptions: SnapshotterOptions = {
	context,
	sizes: ["1280x1024", "1024x768"],
	afterEachScreenshot: jest.fn().mockReturnValue(Promise.resolve()),
	beforeFirstScreenshot: jest.fn().mockReturnValue(Promise.resolve()),
	beforeEachScreenshot: jest.fn().mockReturnValue(Promise.resolve()),
	getMatchOptions: jest.fn().mockReturnValue({
		customSnapshotsDir: "aaa",
		blur: 2,
	}),
};

describe("snapshotter without debugging enabled", () => {
	let originalDebugScope: string = willBeInitialized<string>();

	beforeEach(() => {
		originalDebugScope = createDebug.disable();
	});

	afterEach(() => {
		createDebug.enable(originalDebugScope);
	});

	testSnapshotter();
});

describe("snapshotter with debug enabled", () => {
	let originalDebugScope: string = willBeInitialized<string>();

	beforeEach(() => {
		originalDebugScope = createDebug.disable();
		createDebug.enable("addon-storyshots-selenium:snapshotter");
	});

	afterEach(() => {
		createDebug.enable(originalDebugScope);
	});

	testSnapshotter();
});

function testSnapshotter() {
	it("calls the correct browser- and hook-methods", async () => {
		const { calls, trackMethodsOf } = useCallTracker();

		const options: SnapshotterOptions = trackMethodsOf(snapshotterOptions);
		const browser: Browser = trackMethodsOf(mockBrowser());

		toMatchImageSnapshotMock.mockImplementation((...args: any[]) => {
			calls.push(["toMatchImageSnapshot", ...args]);
			return { pass: true, message: () => "test" };
		});

		const snapshotter = createSnapshotter(options);
		await snapshotter.createSnapshots(browser, "http://storybook:9009");

		const BASIC_HOOK_OPTIONS: BasicHookOptions = {
			browserId: "chrome",
			context: context,
			url: "http://storybook:9009/iframe.html?id=test-story",
		};

		const expectedCalls = [
			["prepareBrowser", "http://storybook:9009/iframe.html?id=test-story"],
			["beforeFirstScreenshot", "mockWebdriver", BASIC_HOOK_OPTIONS],
			["getCurrentUrl"],
			["resizeTo", "1280x1024"],
			["beforeEachScreenshot", "mockWebdriver", { ...BASIC_HOOK_OPTIONS, size: "1280x1024" }],
			["takeScreenshot"],
			[
				"afterEachScreenshot",
				{ ...BASIC_HOOK_OPTIONS, size: "1280x1024", image: "mockScreenshot-1280x1024" },
			],
			["getMatchOptions", { ...BASIC_HOOK_OPTIONS, size: "1280x1024" }],
			["toMatchImageSnapshot", "mockScreenshot-1280x1024", { blur: 2, customSnapshotsDir: "aaa" }],
			["getCurrentUrl"],
			["resizeTo", "1024x768"],
			["beforeEachScreenshot", "mockWebdriver", { ...BASIC_HOOK_OPTIONS, size: "1024x768" }],
			["takeScreenshot"],
			[
				"afterEachScreenshot",
				{ ...BASIC_HOOK_OPTIONS, size: "1024x768", image: "mockScreenshot-1024x768" },
			],
			["getMatchOptions", { ...BASIC_HOOK_OPTIONS, size: "1024x768" }],
			["toMatchImageSnapshot", "mockScreenshot-1024x768", { blur: 2, customSnapshotsDir: "aaa" }],
		];

		for (let i = 0; i < expectedCalls.length; i++) {
			expect(calls[i]).toEqual(expectedCalls[i]);
		}
		expect(calls.length).toEqual(expectedCalls.length);
	});

	it("collects errors", async () => {
		const browser: Browser = mockBrowser();

		toMatchImageSnapshotMock.mockImplementation((...args: any[]) => {
			return { pass: false, message: () => "faking test failure for " + args[0] };
		});

		const snapshotter = createSnapshotter(snapshotterOptions);
		await snapshotter.createSnapshots(browser, "http://storybook:9009");

		expect(snapshotter.errors.map((error) => error.message)).toEqual([
			"faking test failure for mockScreenshot-1280x1024",
			"faking test failure for mockScreenshot-1024x768",
		]);
	});
}

type GenericFunction<ParamsType extends any[], ResultType> = (...args: ParamsType) => ResultType;

function useCallTracker() {
	const calls: any[][] = [];

	function trackedFunction<R, P extends any[]>(
		name: string,
		fn: GenericFunction<P, R>
	): GenericFunction<P, R> {
		return (...args: P) => {
			calls.push([name, ...args]);
			return fn(...args);
		};
	}

	return {
		calls,
		trackMethodsOf<T>(object: T): T {
			const trackedObject = { ...object };
			Object.keys(object).forEach((key) => {
				if (typeof object[key] === "function") {
					trackedObject[key] = trackedFunction(
						key,
						trackedObject[key] as GenericFunction<any, any>
					);
				}
			});
			return trackedObject;
		},
	};
}

function mockBrowser(): Browser {
	let currentUrl: string | null = null;
	let currentSize: string | null = null;
	return {
		id: "chrome",
		async prepareBrowser(url: string): Promise<void> {
			currentUrl = url;
		},
		driver: ("mockWebdriver" as any) as WebDriver,
		getCurrentUrl(): string {
			return currentUrl;
		},
		async resizeTo(size: WidthXHeightString): Promise<void> {
			currentSize = size;
		},
		async takeScreenshot(): Promise<Buffer> {
			return (("mockScreenshot-" + currentSize) as any) as Buffer;
		},
		quit: jest.fn().mockReturnValue(Promise.resolve()),
	};
}
