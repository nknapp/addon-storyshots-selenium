export default {
	title: "hierarchy/with/subnodes",
};

export const leaf = (): HTMLElement => {
	const htmlDivElement = document.createElement("div");
	htmlDivElement.innerHTML = "It's working";
	return htmlDivElement;
};
