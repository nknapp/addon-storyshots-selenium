/* global document */
export function setupStoryview(screenshotUrl) {
	const storyview = document.createElement("iframe");
	storyview.id = "storyview";
	storyview.style.position = "absolute";
	storyview.style.borderRight = "2px solid red";
	storyview.style.borderBottom = "2px solid red";
	storyview.style.left = "0";
	storyview.style.top = "0";
	storyview.width = "1024";
	storyview.height = "768";
	storyview.src = screenshotUrl;
	document.body.appendChild(storyview);
}

export function resizeStoryview(width, height) {
	const storyview = document.getElementById("storyview");
	storyview.width = String(width);
	storyview.height = String(height);
}
