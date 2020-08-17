import { intersect, parseSize } from "./sizes";

describe("intersect", () => {
	it("returns the area occupied by both extents", () => {
		const first = { width: 60, height: 30 };
		const second = { width: 50, height: 50 };
		const result = { width: 50, height: 30 };
		expect(intersect(first, second)).toEqual(result);
	});
});

describe("parseSize", () => {
	it("parses 100x200 into and object containing width and height", () => {
		expect(parseSize("100x200")).toEqual({ width: 100, height: 200 });
	});
});
