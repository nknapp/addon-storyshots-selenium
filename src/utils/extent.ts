interface WidthAndHeight {
	width: number;
	height: number;
}

export class Extent {
	readonly width: number;
	readonly height: number;

	constructor({ width, height }: WidthAndHeight) {
		this.width = width;
		this.height = height;
	}

	liesWithin(other: Extent): boolean {
		return this.width <= other.width && this.height <= other.height;
	}

	intersection(other: Extent): Extent {
		return new Extent({
			width: Math.min(this.width, other.width),
			height: Math.min(this.height, other.height),
		});
	}

	toString(): string {
		return `${this.width}x${this.height}`;
	}
}

export function extentFromSizeString(size: string): Extent {
	const [width, height] = size.split("x").map(Number);
	return extent({ width, height });
}

export function extent({ width, height }: WidthAndHeight): Extent {
	return new Extent({ width, height });
}
