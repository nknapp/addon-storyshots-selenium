import { Debugger } from "debug";

type VoidAsyncFunction = () => Promise<void>;

export function waitMillis(millis: number): VoidAsyncFunction {
	return () => new Promise((resolve) => setTimeout(resolve, millis));
}

export function doNothing(): VoidAsyncFunction {
	return async (): Promise<void> => {
		/* do nothing */
	};
}

export function requireKeyInOptions(object: Record<string, any>, key: string): void {
	if (object[key] == null) {
		throw new Error(`Key "${key}" is required but not found in options`);
	}
}
