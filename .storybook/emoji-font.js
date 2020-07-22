// Ordinarily, this file would be a css file, imported using webpack from 'preview.js'
// But...
// when storyshots determines which stories exist, it also loads preview.js (and the stories),
// and this time, webpack is *not* used. Because there is no CSS-loader present, we will
// get an error. That's why the styles in this file are added in plain javascript.
// After all, this is just a simple test.
// Things might be different when using storybook-react or similar tools.

/*
EmojiSymbols Font (c)blockworks - Kenichi Kaneko
http://emojisymbols.com/
*/
const emojiFontDefinition = document.createElement("style");
emojiFontDefinition.innerHTML = `
@font-face {
	font-family: "EmojiSymbols";
	src: url("emojisymbols/EmojiSymbols-Regular.woff") format("woff");
	text-decoration: none;
	font-style: normal;
}

.emoji {
	font-family: "EmojiSymbols";
	line-height: 1;
}
`;
document.head.appendChild(emojiFontDefinition);
