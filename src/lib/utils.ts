export function firstNonNull<T>(...args: T[]): T {
	return args.find((item) => item != null);
}

export function requireKeyInOptions(object: Record<string, any>, key: string): void {
	if (object[key] == null) {
		throw new Error(`Key "${key}" is required but not found in options`);
	}
}
