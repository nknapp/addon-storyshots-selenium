import { imageSnapshot } from "./index";
import { Browser, createBrowser } from "./internal/browser";
import { createSnapshotter, SnapshotterOptions } from "./internal/snapshotter";
import { ImageSnapshotOptions, StorybookContext } from "./types";
import { createBrowserMockImplementation } from "./internal/__mocks__/browser";
import "./internal/test-utils/to-take-millis-to-resolve";

jest.mock("./internal/browser");
const createBrowserMock = createBrowser as jest.MockedFunction<typeof createBrowser>;

jest.mock("./internal/snapshotter");
const createSnapshotterMock = createSnapshotter as jest.MockedFunction<typeof createSnapshotter>;

beforeEach(() => {
	createSnapshotterMock.mockReset();
	createBrowserMock.mockReset();
	createBrowserMock.mockImplementation(createBrowserMockImplementation);
});

const FIREFOX = {
	id: "firefox",
	capabilities: {
		browserName: "firefox",
	},
};
const CHROME = {
	id: "chrome",
	capabilities: {
		browserName: "chrome",
	},
};

const CONTEXT = { kind: "a-kind", story: { id: "a-story" } };

describe("index", () => {
	let consoleErrorSpy: jest.SpyInstance;

	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, "error");
	});

	afterEach(() => {
		consoleErrorSpy.mockReset();
	});

	it("returns a test-method with beforeAll and afterAll hooks", async () => {
		const testMethod = imageSnapshot({
			browsers: [
				{
					id: "firefox",
					capabilities: {
						browserName: "firefox",
					},
				},
			],
		});

		expect(testMethod).toBeInstanceOf(Function);
		expect(testMethod.beforeAll).toBeInstanceOf(Function);
		expect(testMethod.afterAll).toBeInstanceOf(Function);
	});

	describe("the test-method", () => {
		it("calls the create-snapshot function for each browser", async () => {
			const snapshotterMock = {
				createSnapshots: jest.fn(),
				errors: [],
			};

			createSnapshotterMock.mockReturnValue(snapshotterMock);

			await runTestMethodWithLifeCycle({ browsers: [FIREFOX, CHROME] }, CONTEXT);

			expect(createSnapshotterMock).toHaveBeenCalledTimes(1);
			expect(snapshotterMock.createSnapshots).toHaveBeenCalledTimes(2);
			expect(snapshotterMock.createSnapshots.mock.calls).toContainEqual([
				expect.objectContaining({ id: "chrome" }),
				"http://localhost:6006",
			]);
			expect(snapshotterMock.createSnapshots.mock.calls).toContainEqual([
				expect.objectContaining({ id: "firefox" }),
				"http://localhost:6006",
			]);
		});

		it("does not call the create-snapshot function if the story-parameter 'ignore' is set to true", async () => {
			const snapshotterMock = {
				createSnapshots: jest.fn(),
				errors: [],
			};

			createSnapshotterMock.mockReturnValue(snapshotterMock);

			await runTestMethodWithLifeCycle(
				{ browsers: [FIREFOX, CHROME] },
				{
					...CONTEXT,
					story: {
						...CONTEXT.story,
						parameters: {
							storyshotSelenium: {
								ignore: true,
							},
						},
					},
				}
			);

			expect(createSnapshotterMock).toHaveBeenCalledTimes(0);
		});
	});

	describe("applies default values when creating the snapshotter", () => {
		beforeEach(() => {
			jest.useFakeTimers();
			createSnapshotterMock.mockReturnValue({
				createSnapshots: jest.fn(),
				errors: [],
			});
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it("passes 'context'", async () => {
			const actualOptions = await getActualSnapshotterOptions({}, CONTEXT);
			expect(actualOptions.context).toEqual(CONTEXT);
		});

		it("uses default 'sizes'", async () => {
			const actualOptions = await getActualSnapshotterOptions({}, CONTEXT);
			expect(actualOptions.sizes).toEqual(["1024x768"]);
		});

		it("uses the default 'match-options'", async () => {
			const actualOptions = await getActualSnapshotterOptions({}, CONTEXT);
			const actualMatchOptions = actualOptions.getMatchOptions({
				browserId: "firefox",
				context: CONTEXT,
				size: "1024x768",
				url: "http://example.com",
			});
			expect(actualMatchOptions).toEqual({
				customDiffConfig: {
					includeAA: true,
					threshold: 0.02,
				},
				customSnapshotIdentifier: "a-story-1024x768-firefox",
				customSnapshotsDir: "src/__image_snapshots_selenium__/a-story",
				failureThreshold: 10,
				failureThresholdType: "pixel",
			});
		});

		it("uses the default 'beforeFirstScreenshot'-function", async () => {
			const actualOptions = await getActualSnapshotterOptions({}, CONTEXT);
			await expect(actualOptions.beforeFirstScreenshot).toTakeMillisToResolve(1000);
		});
		it("uses the default 'beforeEachScreenshot'-function", async () => {
			const actualOptions = await getActualSnapshotterOptions({}, CONTEXT);
			await expect(actualOptions.beforeEachScreenshot).toTakeMillisToResolve(200);
		});
		it("uses the default 'afterEachScreenshot'-function", async () => {
			const actualOptions = await getActualSnapshotterOptions({}, CONTEXT);
			await expect(actualOptions.afterEachScreenshot).toTakeMillisToResolve(0);
		});
	});

	describe("applies provided options when calling createSnapshot", () => {
		beforeEach(() => {
			createSnapshotterMock.mockReturnValue({
				createSnapshots: jest.fn(),
				errors: [],
			});
		});
		it("uses the provided 'sizes'", async () => {
			const actualOptions = await getActualSnapshotterOptions({ sizes: ["100x100"] }, CONTEXT);
			expect(actualOptions.sizes).toEqual(["100x100"]);
		});

		it("uses the provided 'merges the getMatchOptions'", async () => {
			const getMatchOptions = () => ({ customSnapshotsDir: "aaa" });
			const actualOptions = await getActualSnapshotterOptions({ getMatchOptions }, CONTEXT);
			const matchOptions = actualOptions.getMatchOptions({
				browserId: "firefox",
				context: CONTEXT,
				size: "1024x768",
				url: "http://example.com",
			});
			expect(matchOptions).toEqual({
				customDiffConfig: {
					includeAA: true,
					threshold: 0.02,
				},
				customSnapshotIdentifier: "a-story-1024x768-firefox",
				customSnapshotsDir: "aaa",
				failureThreshold: 10,
				failureThresholdType: "pixel",
			});
		});

		it("uses the provided 'beforeFirstScreenshot'-function", async () => {
			const beforeFirstScreenshot = jest.fn();
			const actualOptions = await getActualSnapshotterOptions({ beforeFirstScreenshot }, CONTEXT);
			expect(actualOptions.beforeFirstScreenshot).toBe(beforeFirstScreenshot);
		});
		it("uses the default 'beforeEachScreenshot'-function", async () => {
			const beforeEachScreenshot = jest.fn();
			const actualOptions = await getActualSnapshotterOptions({ beforeEachScreenshot }, CONTEXT);
			expect(actualOptions.beforeEachScreenshot).toBe(beforeEachScreenshot);
		});
		it("uses the default 'afterEachScreenshot'-function", async () => {
			const afterEachScreenshot = jest.fn();
			const actualOptions = await getActualSnapshotterOptions({ afterEachScreenshot }, CONTEXT);
			expect(actualOptions.afterEachScreenshot).toBe(afterEachScreenshot);
		});
	});

	it("if the errors-property of the snapshotter is not empty after execution, it throws the first and logs the others", async () => {
		createSnapshotterMock.mockReturnValue({
			createSnapshots: jest.fn(),
			errors: [new Error("error1"), new Error("error2")],
		});

		await expect(() => runTestMethodWithLifeCycle({ browsers: [CHROME] }, CONTEXT)).rejects.toThrow(
			/error1/
		);

		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringMatching(/Found 2 errors/));
	});

	it("creates browsers with the correct options", async () => {
		createSnapshotterMock.mockReturnValue({
			createSnapshots: jest.fn(),
			errors: [],
		});
		const seleniumUrl = "http://someUrl:9009";

		const testMethod = imageSnapshot({ seleniumUrl, browsers: [CHROME, FIREFOX] });

		await testMethod.beforeAll();

		expect(createBrowserMock).toHaveBeenCalledTimes(2);
		expect(createBrowserMock).toHaveBeenCalledWith(seleniumUrl, CHROME);
		expect(createBrowserMock).toHaveBeenCalledWith(seleniumUrl, FIREFOX);
	});

	it("closes all browsers afterwards", async () => {
		createSnapshotterMock.mockReturnValue({
			createSnapshots: jest.fn(),
			errors: [],
		});

		const testMethod = imageSnapshot({ browsers: [CHROME, FIREFOX] });

		await testMethod.beforeAll();
		await testMethod.afterAll();

		const browsers: jest.MockResult<Browser>[] = createBrowserMock.mock.results;
		expect(browsers.length).toEqual(2);
		expect(browsers[0].value.close).toHaveBeenCalled();
		expect(browsers[1].value.close).toHaveBeenCalled();
	});

	it("afterAll ignore missing browsers", async () => {
		createSnapshotterMock.mockReturnValue({
			createSnapshots: jest.fn(),
			errors: [],
		});

		const testMethod = imageSnapshot({ browsers: [CHROME, FIREFOX] });

		await expect(() => testMethod.afterAll()).not.toThrow();
	});
});

async function runTestMethodWithLifeCycle(
	options: ImageSnapshotOptions,
	context: StorybookContext
) {
	const testMethod = imageSnapshot(options);

	await testMethod.beforeAll();
	try {
		await testMethod(context);
	} finally {
		await testMethod.afterAll();
	}
}

async function getActualSnapshotterOptions(
	nonRequiredOptions: Partial<ImageSnapshotOptions>,
	context: StorybookContext
): Promise<SnapshotterOptions> {
	await runTestMethodWithLifeCycle({ browsers: [CHROME], ...nonRequiredOptions }, context);
	return createSnapshotterMock.mock.calls[0][0];
}
