/**
 * A function that returns a void-promise
 */
type VoidAsyncFunction = () => Promise<void>;

/**
 * Returns a async function that resolves after the specified time in milliseconds.
 *
 * This function can be used to configure a delay in the `Before*Screenshot` hooks.
 *
 * @param millis the number of milliseconds
 */
export function waitMillis(millis: number): VoidAsyncFunction {
	return () => new Promise((resolve) => setTimeout(resolve, millis));
}

/**
 * returns an async function that resolves immediately, without doing anything.
 */
export function doNothing(): VoidAsyncFunction {
	return async (): Promise<void> => {
		/* do nothing */
	};
}
