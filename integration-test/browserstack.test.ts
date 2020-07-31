/* eslint-env jest */
import initStoryshots from "@storybook/addon-storyshots";
import { doNothing, imageSnapshot, waitMillis } from "../src";
import browserstack from "browserstack-local";
import { promisify } from "util";
import { storybookStaticServer } from "./test-utils/server";

if (process.env.BROWSERSTACK_ACCESS_KEY == null || process.env.BROWSERSTACK_USERNAME == null) {
	// eslint-disable-next-line no-console
	console.warn(
		"if you want to run tests with browserstack, please set the environment variables BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY",
		doNothing()
	);
} else {
	const browserstackLocal = new browserstack.Local();

	const key = process.env.BROWSERSTACK_ACCESS_KEY;
	const username = process.env.BROWSERSTACK_USERNAME;
	const browserstackURL = `https://${username}:${key}@hub-cloud.browserstack.com/wd/hub`;

	const start = promisify(browserstackLocal.start).bind(browserstackLocal);
	beforeAll(async () => start({ key: key }));

	const stop = promisify(browserstackLocal.stop).bind(browserstackLocal);
	afterAll(async () => stop());

	const server = storybookStaticServer(9010);
	beforeAll(async () => server.start());
	afterAll(async () => server.stop());

	initStoryshots({
		framework: "html",
		suite: "All",
		test: imageSnapshot({
			sizes: ["1280x1024", "1024x768", "800x600", "320x640"],
			browsers: [
				{
					id: "ie11",
					capabilities: {
						os: "windows",
						os_version: "10",
						browserName: "IE",
						browser_version: "11.0",
						resolution: "1920x1080",
						"browserstack.local": true,
					},
				},
				{
					id: "safari",
					capabilities: {
						os: "os x",
						browserName: "safari",
						browser_version: "latest",
						resolution: "1920x1080",
						"browserstack.local": true,
					},
				},
			],
			seleniumUrl: browserstackURL,
			storybookUrl: "http://localhost:9010",
			snapshotBaseDirectory: __filename + "-snapshots",
			beforeFirstScreenshot: waitMillis(5000),
			testTimeoutMillis: 30000,
		}),
	});
}
