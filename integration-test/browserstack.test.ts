/* eslint-env jest */
import initStoryshots from "@storybook/addon-storyshots";
import { v4 as uuidV4 } from "uuid";
import { tunnel } from "./test-utils/browserstack-tunnel";
import { imageSnapshot, waitMillis } from "../src";

import { storybookStaticServer } from "./test-utils/server";

if (process.env.BROWSERSTACK_ACCESS_KEY == null || process.env.BROWSERSTACK_USERNAME == null) {
	throw new Error(
		"if you want to run tests with browserstack, please set the environment variables BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY"
	);
} else {
	const localIdentifier = uuidV4();
	beforeAll(() => tunnel.start({ localIdentifier }), 10000);
	afterAll(() => tunnel.stop(), 10000);
	const key = process.env.BROWSERSTACK_ACCESS_KEY;
	const username = process.env.BROWSERSTACK_USERNAME;
	const browserstackURL = `https://${username}:${key}@hub-cloud.browserstack.com/wd/hub`;
	const browsers = [
		{
			id: "ie11",
			capabilities: {
				os: "windows",
				os_version: "10",
				browserName: "IE",
				browser_version: "11.0",
				resolution: "1920x1080",
				"browserstack.local": true,
				"browserstack.localIdentifier": localIdentifier,
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
				"browserstack.localIdentifier": localIdentifier,
			},
		},
	];
	const storybookServerPort = 9010;
	const server = storybookStaticServer(storybookServerPort);
	beforeAll(async () => server.start());

	afterAll(async () => server.stop());
	initStoryshots({
		framework: "html",
		suite: "All",
		test: imageSnapshot({
			sizes: ["1280x1024", "1024x768", "800x600", "320x640"],
			browsers,
			seleniumUrl: browserstackURL,
			storybookUrl: `http://localhost:${storybookServerPort}`,
			snapshotBaseDirectory: __filename + "-snapshots",
			testTimeoutMillis: 30000,
			beforeFirstScreenshot: waitMillis(3000),
		}),
	});
}
