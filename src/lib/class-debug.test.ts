import { addDebugLogAllMethods, addDebugLogToClass, DebugLite } from "./class-debug";

describe("The 'addDebugLogAllMethods'-function", () => {
	let outputCollector = [];
	const dummyDebug: DebugLite = createDummyDebug((...args) => outputCollector.push(args));

	beforeEach(() => {
		outputCollector = [];
		dummyDebug.enabled = true;
	});

	describe("it should return a function that", () => {
		it("logs start and end of a successful function block", () => {
			const proxy = addDebugLogAllMethods(dummyDebug, "testLogger", {
				testFunction: () => outputCollector.push("Actual execution"),
			});

			proxy.testFunction();

			expect(outputCollector).toEqual([
				['section "testLogger#testFunction" starting'],
				"Actual execution",
				['section "testLogger#testFunction" done'],
			]);
		});

		it("logs function calls from within the object", () => {
			const proxy = addDebugLogAllMethods(dummyDebug, "testLogger", {
				outer() {
					outputCollector.push("outer");
					this.inner();
				},
				inner() {
					outputCollector.push("inner");
				},
			});

			proxy.outer();

			expect(outputCollector).toEqual([
				['section "testLogger#outer" starting'],
				"outer",
				['section "testLogger#inner" starting'],
				"inner",
				['section "testLogger#inner" done'],
				['section "testLogger#outer" done'],
			]);
		});

		it("works with classes", () => {
			class TestClass {
				outer() {
					outputCollector.push("outer");
					this.inner();
				}
				inner() {
					outputCollector.push("inner");
				}
			}
			const proxy = addDebugLogAllMethods(dummyDebug, "testLogger", new TestClass());

			proxy.outer();

			expect(outputCollector).toEqual([
				['section "testLogger#outer" starting'],
				"outer",
				['section "testLogger#inner" starting'],
				"inner",
				['section "testLogger#inner" done'],
				['section "testLogger#outer" done'],
			]);
		});

		it("start and error of a function block throwing an exception", () => {
			const proxy = addDebugLogAllMethods(dummyDebug, "testLogger", {
				testFunction() {
					outputCollector.push("Actual execution");
					throw new Error("Test-Error");
				},
			});

			expect(() => {
				proxy.testFunction();
			}).toThrow(/Test-Error/);

			expect(outputCollector).toEqual([
				['section "testLogger#testFunction" starting'],
				"Actual execution",
				['section "testLogger#testFunction" threw ', new Error("Test-Error")],
			]);
		});

		it("waits for promises to be resolved", async () => {
			const proxy = addDebugLogAllMethods(dummyDebug, "testLogger", {
				async testFunction() {
					await Promise.resolve();
					outputCollector.push("Actual execution");
				},
			});

			await proxy.testFunction();

			expect(outputCollector).toEqual([
				['section "testLogger#testFunction" starting'],
				"Actual execution",
				['section "testLogger#testFunction" done'],
			]);
		});

		it("handles rejected promises like exceptions", async () => {
			const proxy = addDebugLogAllMethods(dummyDebug, "testLogger", {
				async testFunction() {
					await Promise.resolve();
					outputCollector.push("Actual execution");
					throw new Error("Test-Error");
				},
			});

			await expect(async () => {
				await proxy.testFunction();
			}).rejects.toThrow(/Test-Error/);

			expect(outputCollector).toEqual([
				['section "testLogger#testFunction" starting'],
				"Actual execution",
				['section "testLogger#testFunction" threw ', new Error("Test-Error")],
			]);
		});

		it("does not call logger if disabled", () => {
			dummyDebug.enabled = false;
			const proxy = addDebugLogAllMethods(dummyDebug, "testLogger", {
				testFunction: () => outputCollector.push("Actual execution"),
			});

			proxy.testFunction();

			expect(outputCollector).toEqual(["Actual execution"]);
		});

		it("delegates property access", () => {
			const proxy = addDebugLogAllMethods(dummyDebug, "testLogger", {
				aProperty: 5,
			});
			expect(proxy.aProperty).toEqual(5);
		});
	});
});

describe("The 'addDebugLogToClass' function", () => {
	let outputCollector = [];
	const dummyDebug: DebugLite = createDummyDebug((...args) => outputCollector.push(args));

	beforeEach(() => {
		outputCollector = [];
		dummyDebug.enabled = true;
	});

	it("adds the debug log to a constructed class", () => {
		class TestClass {
			private message: string;
			constructor(message: string) {
				this.message = message;
			}
			outer() {
				outputCollector.push("outer");
				this.inner();
			}
			inner() {
				outputCollector.push("inner");
			}
		}

		const TestClassWithDebugLog = addDebugLogToClass(dummyDebug, () => "testLogger", TestClass);

		const loggingObject = new TestClassWithDebugLog("some message");
		loggingObject.outer();

		expect(outputCollector).toEqual([
			['section "testLogger#outer" starting'],
			"outer",
			['section "testLogger#inner" starting'],
			"inner",
			['section "testLogger#inner" done'],
			['section "testLogger#outer" done'],
		]);
	});
});

function createDummyDebug(logFn: (...args: any[]) => any, options = { enabled: true }): DebugLite {
	const result = (...args) => logFn(...args);
	result.enabled = options.enabled;
	return result;
}
