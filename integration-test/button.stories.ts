/* istanbul ignore file */

export default {
	title: "Button",
	parameters: {
		storyshotSelenium: {
			sizes: ["320x200"],
		},
	},
};

export const withText = () => '<button class="btn">Hello World</button>';

export const withEmoji = () => {
	const button = document.createElement("button");
	button.className = "emoji";
	button.innerText = "😀 😎 👍 💯";
	return button;
};

export const browserInfo = () => {
	const button = document.createElement("button");
	const updateButtonLabel = () => {
		button.innerText =
			"height" + window.innerWidth + "x" + window.innerHeight + " - " + navigator.userAgent;
	};
	updateButtonLabel();
	window.addEventListener("resize", updateButtonLabel);
	return button;
};

browserInfo.story = {
	parameters: {
		delayBeforeScreenshot: 500,
	},
};

export const responsive = () => {
	const styles = document.createElement("style");
	styles.innerHTML = `
#responsiveStyling {
    display: flex;
}

button::after {
    	content: ' max-width: 600px'
}

@media (max-width: 600px) {
    button::after {
    	content: ' max-width: 600px'
    }
}
	`;

	const button = document.createElement("button");
	button.className = "responsiveLabel";
	button.style.border = "1px solid black";
	button.innerHTML = `Button1
	<style>
	  .responsiveLabel::after {
	  		content: ' default'
	  }
	  @media (max-width: 1000px) {
			.responsiveLabel::after {
					content: ' max-width: 1000px'
			}
	  }

	  @media (max-width: 600px) {
			.responsiveLabel::after {
					content: ' max-width: 600px'
			}
	  }

  </style>

	`;
	return button;
};

responsive.story = {
	parameters: {
		storyshotSelenium: {
			sizes: ["800x600", "320x640", "1024x768"],
		},
	},
};
