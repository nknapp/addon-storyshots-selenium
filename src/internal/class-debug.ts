/* eslint-disable @typescript-eslint/ban-types */
import { createSectionDebug } from "./utils/section-debug";

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

export function addDebugLogToClass<T extends object>(
	debug: DebugLite,
	scopeProvider: (...constructorArgs) => string,
	wrappedClass: T
): T {
	if (!debug.enabled) {
		return wrappedClass;
	}
	return new Proxy<T>(wrappedClass, {
		construct(target: T, argArray: any): object {
			const newInstance: object = new (target as any)(...argArray);
			return addDebugLogAllMethods(debug, scopeProvider(...argArray), newInstance);
		},
	});
}
