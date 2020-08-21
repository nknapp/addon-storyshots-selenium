/* eslint-disable @typescript-eslint/ban-types */
import { createSectionDebug } from "./section-debug";

export interface DebugLite {
	(...args: any[]): void;

	enabled: boolean;
}

export function addDebugLogAllMethods<T extends object>(
	debug: DebugLite,
	scope: string,
	wrappedObject: T
): T {
	if (!debug.enabled) {
		return wrappedObject;
	}
	const sectionDebug = createSectionDebug(debug);
	return new Proxy<T>(wrappedObject, {
		get(target, prop, receiver) {
			const result = Reflect.get(target, prop, receiver);
			if (typeof result == "function") {
				return (...args) =>
					sectionDebug(scope + "#" + String(prop), () => result.call(receiver, ...args));
			}
			return result;
		},
	});
}
