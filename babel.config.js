module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				targets: {
					node: "current",
				},
			},
		],
		"@babel/preset-typescript",
	],
	env: {
		production: {
			comments: false,
			ignore: ["src/**/*.test.ts", "src/internal/test-utils/**"],
		},
	},
};
