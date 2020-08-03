import { Extent } from "./extent";

describe("intersection", () => {
	it("returns the area occupied by both extents", () => {
		const first = Extent.of({ width: 60, height: 30 });
		const second = Extent.of({ width: 50, height: 50 });
		const result = Extent.of({ width: 50, height: 30 });
		expect(first.intersection(second)).toEqual(result);
	});
});
