export async function forEachSequential(array, asyncIterator) {
	for (let i = 0; i < array.length; i++) {
		await asyncIterator(array[i]);
	}
}
