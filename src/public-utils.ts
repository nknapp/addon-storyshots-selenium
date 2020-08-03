type VoidAsyncFunction = () => Promise<void>;

export function waitMillis(millis: number): VoidAsyncFunction {
	return () => new Promise((resolve) => setTimeout(resolve, millis));
}

export function doNothing(): VoidAsyncFunction {
	return async (): Promise<void> => {
		/* do nothing */
	};
}
