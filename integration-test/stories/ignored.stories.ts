/* istanbul ignore file */

export default {
	title: "Ignored Stories",
	parameters: {
		storyshotSelenium: {
			ignore: true,
			sizes: ["320x200"],
		},
	},
};

export const withText = (): string => '<button class="btn">Hello World</button>';

export const withEmoji = (): HTMLElement => {
	const button = document.createElement("button");
	button.className = "emoji";
	button.innerText = "😀 😎 👍 💯";
	return button;
};
