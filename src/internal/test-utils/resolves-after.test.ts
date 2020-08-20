import "./resolves-after";

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test("suceeds, if promise resolution takes the expected time", async () => {
	await expect(() => delay(1000)).toTakeMillisToResolve(1000);
});

test("suceeds, if promise resolution takes the expected time", async () => {
	await expect(() => delay(500)).not.toTakeMillisToResolve(1000);
});

test("suceeds, if promise resolution takes the expected time", async () => {
	await expect(() => delay(2000)).not.toTakeMillisToResolve(1000);
});

function delay(millis: number): Promise<void> {
	return new Promise<void>((resolve) => setTimeout(resolve, millis));
}
