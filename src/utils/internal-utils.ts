export function firstNonNull<T>(...args: T[]): T {
	return args.find((item) => item != null);
}

export function requireKeyInOptions(object: Record<string, any>, key: string): void {
	if (object[key] == null) {
		throw new Error(`Key "${key}" is required but not found in options`);
	}
}

interface SectionDebug {
	<T>(section: string, fn: Provider<T>): T;
}

interface Provider<T> {
	(): T;
}

export interface DebugLite {
	(...args: any[]): void;

	enabled: boolean;
}

type PossiblePromise<T> = PromiseLike<T> | T;

export function createSectionDebug(debug: DebugLite): SectionDebug {
	function logSuccessAndReturn<T>(section: string, result: T) {
		debug(`section "${section}" done`);
		return result;
	}

	function logErrorAndThrow(section: string, error: Error) {
		debug(`section "${section}" threw `, error);
		throw error;
	}

	function withDebugLog<T extends PossiblePromise<any>>(section: string, fn: Provider<T>): T {
		debug(`section "${section}" starting`);
		try {
			const result: PossiblePromise<any> = fn();
			if (result != null && result.then != null) {
				return result.then(
					async (value) => logSuccessAndReturn(section, value),
					async (error) => logErrorAndThrow(section, error)
				);
			}
			return logSuccessAndReturn(section, result);
		} catch (error) {
			logErrorAndThrow(section, error);
		}
	}

	if (debug.enabled) {
		return withDebugLog;
	} else {
		return (section, fn) => fn();
	}
}
