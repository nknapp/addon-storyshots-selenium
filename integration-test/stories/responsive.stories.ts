export default {
	title: "responsive component",
};

export const responsive = (): HTMLElement => {
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

responsive.parameters = {
	storyshotSelenium: {
		sizes: ["800x600", "320x640", "1024x768"],
	},
};
