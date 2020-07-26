type Iterator<T> = (item: T) => Promise<void>;

export async function forEachSequential<T>(array: T[], asyncIterator: Iterator<T>): Promise<void> {
	for (let i = 0; i < array.length; i++) {
		await asyncIterator(array[i]);
	}
}
