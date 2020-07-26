export default {
	title: "Image Boundaries",
	parameters: {
		storyshotSelenium: {
			sizes: ["320x200", "640x400", "800x600", "1280x1024", "1920x1080"],
		},
	},
};

export const Boundaries = () => {
	const div = document.createElement("div");
	div.style.position = "absolute";
	div.className = "boundary-checker";
	div.style.width = "100%";
	div.style.height = "100%";
	div.innerHTML = `
        <style>
        
            html, body {
                margin: 0 !important;
                padding:0 !important;
                width: 100% !important;
                height: 100% !important;
            }
            .boundary-checker .top {
                top: 0;
            }            
            .boundary-checker .left {
                left: 0;
            }
            .boundary-checker .right {
                right: 0;
            }
            .boundary-checker .bottom {
                bottom: 0;
            }
            .boundary-checker div {
                position: absolute;
                border: 5px solid black;
                width: 40%;
                height: 40%;
                vertical-align: middle;
                padding: 5px;
            }
            
                        
        </style>
        <div class="top left">top left</div>
        <div class="top right">top right</div>
        <div class="bottom left">bottom left</div>
        <div class="bottom right">bottom right</div>
    `;
	return div;
};
