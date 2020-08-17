import { firstNonNull, requireKeyInOptions } from "./null-handling";

describe("firstNonNull", () => {
	it("returns a the first value if it is neither null nor undefined", () => {
		expect(firstNonNull("first", "second")).toEqual("first");
	});
	it("returns the second value if the first is undefined", () => {
		expect(firstNonNull(undefined, "second")).toEqual("second");
	});
	it("returns the second value if the first is null", () => {
		expect(firstNonNull(null, "second")).toEqual("second");
	});
});

describe("requireKeyInOptions", () => {
	it("does nothing it the property exists and non-null", () => {
		expect(() => requireKeyInOptions({ key: "value" }, "key")).not.toThrow();
	});

	it("throws an readable error if the property does not exist", () => {
		expect(() => requireKeyInOptions({}, "key")).toThrow(
			'Key "key" is required but not found in options'
		);
	});

	it("throws an readable error if the property is null", () => {
		expect(() => requireKeyInOptions({ key: null }, "key")).toThrow(
			'Key "key" is required but not found in options'
		);
	});
});
