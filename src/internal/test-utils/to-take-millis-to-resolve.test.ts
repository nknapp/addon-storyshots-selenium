import "./to-take-millis-to-resolve";

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test("suceeds, if promise resolution takes the expected time", async () => {
	await expect(() => delay(1000)).toTakeMillisToResolve(1000);
});

test("fails, if the promise resolution is considerably faster", async () => {
	await expect(() => delay(500)).not.toTakeMillisToResolve(1000);
});

test("fails, if the promise resolution is considerably slower", async () => {
	await expect(() => delay(2000)).not.toTakeMillisToResolve(1000);
});

test("suceeds, if the lower threshold is less then zero", async () => {
	await expect(() => delay(10)).toTakeMillisToResolve(10);
});

function delay(millis: number): Promise<void> {
	return new Promise<void>((resolve) => setTimeout(resolve, millis));
}
