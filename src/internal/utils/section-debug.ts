interface SectionDebug {
	<T>(section: string, fn: Provider<T>): T;
}

type Provider<T> = () => T;

export interface DebugLite {
	(...args: any[]): void;
	enabled: boolean;
}

type PossiblePromise<T> = PromiseLike<T> | T;

export function createSectionDebug(debug: DebugLite): SectionDebug {
	if (debug.enabled) {
		return withDebugLog;
	} else {
		return (section, fn) => fn();
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

	function logSuccessAndReturn<T>(section: string, result: T) {
		debug(`section "${section}" done`);
		return result;
	}

	function logErrorAndThrow(section: string, error: Error) {
		debug(`section "${section}" threw `, error);
		throw error;
	}
}
