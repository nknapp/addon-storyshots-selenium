import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "../src/index";
import browserstack from "browserstack-local";

import "trace";

const browserstackLocal = new browserstack.Local();
const { promisify } = require("util");

browserstackLocal.startPromised = promisify(browserstackLocal.start);
browserstackLocal.stopPromised = promisify(browserstackLocal.stop);

const key = process.env.BROWSER_STACK_KEY;
const username = process.env.BROWSER_STACK_USERNAME;
var browserstackURL = `https://${username}:${key}@hub-cloud.browserstack.com/wd/hub`;

beforeAll(async () => browserstackLocal.startPromised({ key: key }));
afterAll(async () => browserstackLocal.stopPromised());

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
					"browserstack.local": true,
				},
			},
			{
				id: "chrome",
				capabilities: {
					os: "windows",
					os_version: "10",
					browserName: "chrome",
					browser_version: "latest",
					"browserstack.local": true,
				},
			},
			{
				id: "firefox",
				capabilities: {
					os: "windows",
					os_version: "10",
					browserName: "firefox",
					browser_version: "latest",
					"browserstack.local": true,
				},
			},
			{
				id: "safari",
				capabilities: {
					os: "os x",
					browserName: "safari",
					browser_version: "latest",
					"browserstack.local": true,
				},
			},
		],
		seleniumUrl: browserstackURL,
		storybookUrl: "http://localhost:9009",
		snapshotDirectory: __filename + "-snapshots",
		beforeScreenshot() {
			// Give the browser a chance to load the emoji font
			return new Promise((resolve) => setTimeout(resolve, 500));
		},
		testTimeoutMillis: 30000,
	}),
});
