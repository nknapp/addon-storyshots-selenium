import "./to-take-millis-to-resolve";

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test("suceeds, if promise resolution takes the expected time", async () => {
	await expect(() => delay(1000)).toTakeMillisToResolve(1000);
});

test("shows an adequate message, if the condition is negated and fails", async () => {
	await expect(async () => {
		await expect(() => delay(1000)).not.toTakeMillisToResolve(1000);
	}).rejects.toThrow(/Promise took about 1000 milliseconds to resolve/);
});

test("fails, if the promise resolution is considerably faster", async () => {
	await expect(async () => {
		await expect(() => delay(500)).toTakeMillisToResolve(1000);
	}).rejects.toThrow(/Promise was resolved at least 50 millis to early/);
});

test("fails, if the promise resolution is considerably slower", async () => {
	await expect(async () => {
		await expect(() => delay(2000)).toTakeMillisToResolve(1000);
	}).rejects.toThrow(/Promise was resolved at least 50 millis to late/);
});

test("suceeds, if the lower threshold is less then zero", async () => {
	await expect(() => delay(10)).toTakeMillisToResolve(10);
});

function delay(millis: number): Promise<void> {
	return new Promise<void>((resolve) => setTimeout(resolve, millis));
}
