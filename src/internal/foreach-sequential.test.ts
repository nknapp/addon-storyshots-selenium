import { forEachSequential } from "./foreach-sequential";

describe("foreach-sequential", () => {
	it("iterates an array an calls the async callback one after another", async () => {
		const sink = [];
		await forEachSequential([1, 2, 3, 4, 5], async (item) => {
			await delay(100);
			sink.push(item);
		});

		expect(sink).toEqual([1, 2, 3, 4, 5]);
	});
});

function delay(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
