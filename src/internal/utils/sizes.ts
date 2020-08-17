import { WidthXHeightString } from "../../types";
import { WidthAndHeight } from "../internal-types";

export function parseSize(size: WidthXHeightString): WidthAndHeight {
	const [width, height] = size.split("x").map(Number);
	return { width, height };
}

export function intersect(...sizes: WidthAndHeight[]): WidthAndHeight {
	return {
		width: Math.min(...sizes.map((size) => size.width)),
		height: Math.min(...sizes.map((size) => size.height)),
	};
}
