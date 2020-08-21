const THRESHOLD = 50;

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace jest {
		interface Matchers<R, T> {
			toTakeMillisToResolve(millis: number): R;
		}
	}
}

export async function toTakeMillisToResolve(
	factory: () => Promise<unknown>,
	millis: number
): Promise<jest.CustomMatcherResult> {
	const afterwards = jest.fn();

	const done = factory().then(afterwards);

	const lowerThreshold = millis - THRESHOLD;
	if (lowerThreshold > 0) {
		jest.advanceTimersByTime(lowerThreshold);
		await Promise.resolve();
		if (afterwards.mock.calls.length > 0) {
			return {
				pass: false,
				message: () => `Promise was resolved at least ${THRESHOLD} millis to early`,
			};
		}
	}

	jest.advanceTimersByTime(2 * THRESHOLD);
	await Promise.resolve();
	if (afterwards.mock.calls.length === 0) {
		return {
			pass: false,
			message: () => `Promise was resolved at least ${THRESHOLD} millis to late`,
		};
	}

	await done;

	return {
		pass: true,
		message: () => `Resolved after ${millis} milliseconds`,
	};
}

expect.extend({ toTakeMillisToResolve });
