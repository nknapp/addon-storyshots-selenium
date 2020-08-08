/* global document */
import { WidthAndHeight } from "./types";

export function setupStoryviewIframe(screenshotUrl: string): void {
	const storyview = document.createElement("iframe");
	storyview.id = "storyview";
	storyview.style.position = "absolute";
	storyview.style.borderTop = "0";
	storyview.style.borderLeft = "0";
	storyview.style.borderRight = "2px solid red";
	storyview.style.borderBottom = "2px solid red";
	storyview.style.left = "0";
	storyview.style.top = "0";
	storyview.width = "1024";
	storyview.height = "768";
	storyview.src = screenshotUrl;
	document.body.appendChild(storyview);
}

export function resizeStoryview(width: number, height: number): void {
	const storyview = document.getElementById("storyview") as HTMLIFrameElement;
	storyview.width = String(width);
	storyview.height = String(height);
}

export function getViewportSize(): WidthAndHeight {
	return { width: window.innerWidth, height: window.innerHeight };
}
