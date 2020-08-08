import createDebug from "debug";
import { createSectionDebug, DebugLite } from "./section-debug";
import { waitMillis } from "..";

const TEST_DEBUG_SCOPE = "addon-storyhots-selenium:test";

describe("The 'debugSection'-function", () => {
	let oldScopes = "";

	beforeAll(() => {
		oldScopes = createDebug.disable();
		createDebug.enable(TEST_DEBUG_SCOPE);
	});

	afterAll(() => {
		createDebug.enable(oldScopes);
	});

	describe("it should return a function that", () => {
		it("logs start and end of a successful function block", () => {
			const output = [];
			const debug = createDummyDebug((...args) => output.push(args));
			const sectionDebug = createSectionDebug(debug);

			sectionDebug("testLogger", () => {
				output.push("Actual execution");
			});
			expect(output).toEqual([
				['section "testLogger" starting'],
				"Actual execution",
				['section "testLogger" done'],
			]);
		});

		it("start and error of a function block throwing an exception", () => {
			const output = [];
			const debug = createDummyDebug((...args) => output.push(args));
			const sectionDebug = createSectionDebug(debug);

			expect(() => {
				sectionDebug("testLogger", () => {
					output.push("Actual execution");
					throw new Error("Test-Error");
				});
			}).toThrow(/Test-Error/);

			expect(output).toEqual([
				['section "testLogger" starting'],
				"Actual execution",
				['section "testLogger" threw ', new Error("Test-Error")],
			]);
		});

		it("waits for promises to be resolved", async () => {
			const output = [];
			const debug = createDummyDebug((...args) => output.push(args));
			const sectionDebug = createSectionDebug(debug);

			await sectionDebug("testLogger", async () => {
				await waitMillis(100)();
				output.push("Actual execution");
			});
			expect(output).toEqual([
				['section "testLogger" starting'],
				"Actual execution",
				['section "testLogger" done'],
			]);
		});

		it("handles rejected promises like exceptions", async () => {
			const output = [];
			const debug = createDummyDebug((...args) => output.push(args));
			const sectionDebug = createSectionDebug(debug);

			await expect(async () => {
				await sectionDebug("testLogger", async () => {
					await waitMillis(100)();
					output.push("Actual execution");
					throw new Error("Test-Error");
				});
			}).rejects.toThrow(/Test-Error/);

			expect(output).toEqual([
				['section "testLogger" starting'],
				"Actual execution",
				['section "testLogger" threw ', new Error("Test-Error")],
			]);
		});

		it("does not call logger if disabled", () => {
			const output = [];
			const debug = createDummyDebug((...args) => output.push(args), { enabled: false });
			const sectionDebug = createSectionDebug(debug);

			sectionDebug("testLogger", () => {
				output.push("Actual execution");
			});

			expect(output).toEqual(["Actual execution"]);
		});
	});
});

function createDummyDebug(logFn: (...args: any[]) => any, options = { enabled: true }): DebugLite {
	const result = (...args) => logFn(...args);
	result.enabled = options.enabled;
	return result;
}
