import { imageSnapshot } from "./index";
import { createBrowser } from "./internal/browser";
import { createSnapshotter, SnapshotterOptions } from "./internal/snapshotter";
import { ImageSnapshotOptions, StorybookContext } from "./types";
import { createBrowserMockImplementation } from "./internal/__mocks__/browser";
import "./internal/test-utils/resolves-after";

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
	});

	describe("applies default values when creating the snapshotter", async () => {
		const DEFAULT_OPTIONS = { browsers: [CHROME] };

		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it("passes 'context'", async () => {
			const actualOptions = await getActualSnapshotterOptions(DEFAULT_OPTIONS, CONTEXT);
			expect(actualOptions.context).toEqual(CONTEXT);
		});

		it("passes 'sizes'", async () => {
			const actualOptions = await getActualSnapshotterOptions(DEFAULT_OPTIONS, CONTEXT);
			expect(actualOptions.sizes).toEqual(["1024x768"]);
		});

		it("uses the default 'match-options'", async () => {
			const actualOptions = await getActualSnapshotterOptions(DEFAULT_OPTIONS, CONTEXT);
			const actualMatchOptions = actualOptions.getMatchOptions({
				browserId: "firefox",
				context: CONTEXT,
				size: "1024x768",
				url: "http://example.com",
			});
			expect(actualMatchOptions).toEqual({
				customSnapshotIdentifier: "a-story-1024x768-firefox",
				customSnapshotsDir: "src/__image_snapshots_selenium__/a-story",
			});
		});

		it("uses the default 'beforeFirstScreenshot", async () => {
			const actualOptions = await getActualSnapshotterOptions(DEFAULT_OPTIONS, CONTEXT);
			expect(actualOptions.beforeFirstScreenshot).toTakeMillisToResolve(1000);
		});
		it("uses the default 'beforeEachScreenshot", async () => {
			const actualOptions = await getActualSnapshotterOptions(DEFAULT_OPTIONS, CONTEXT);
			expect(actualOptions.beforeEachScreenshot).toTakeMillisToResolve(200);
		});
		it("uses the default 'afterEachScreenshot", async () => {
			const actualOptions = await getActualSnapshotterOptions(DEFAULT_OPTIONS, CONTEXT);
			expect(actualOptions.afterEachScreenshot).toTakeMillisToResolve(0);
		});
	});

	it("applies provided options when calling createSnapshot", () => {
		fail("not yet implemented");
	});

	it("throws if the errors-property of the snapshotter is not empty after execution", () => {
		fail("not yet implemented");
	});

	it("creates browsers with the correct options", () => {
		fail("not yet implemented");
	});

	it("closes all browsers afterwards", () => {
		fail("not yet implemented");
	});

	it("closes all browsers aftwareds, if tests fail", () => {
		fail("not yet implemented");
	});
});

async function runTestMethodWithLifeCycle(
	options: ImageSnapshotOptions,
	context: StorybookContext
) {
	const testMethod = imageSnapshot(options);

	await testMethod.beforeAll();
	try {
		testMethod(context);
	} finally {
		await testMethod.afterAll();
	}
}

async function getActualSnapshotterOptions(
	options: ImageSnapshotOptions,
	context: StorybookContext
): Promise<SnapshotterOptions> {
	await runTestMethodWithLifeCycle(options, context);
	return createSnapshotterMock.mock.calls[0][0];
}
