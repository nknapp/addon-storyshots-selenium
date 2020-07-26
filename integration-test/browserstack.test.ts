/* eslint-env jest */
import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot, waitMillis } from "../src/index";
import browserstack from "browserstack-local";

import "trace";

const browserstackLocal = new browserstack.Local();
import { promisify } from "util";

const key = process.env.BROWSER_STACK_KEY;
const username = process.env.BROWSER_STACK_USERNAME;
const browserstackURL = `https://${username}:${key}@hub-cloud.browserstack.com/wd/hub`;

const start = promisify(browserstackLocal.start).bind(browserstackLocal);
beforeAll(async () => start({ key: key }));

const stop = promisify(browserstackLocal.stop).bind(browserstackLocal);
afterAll(async () => stop);

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
		storybookUrl: "http://localhost:9009",
		snapshotDirectory: __filename + "-snapshots",
		beforeFirstScreenshot: waitMillis(5000),
		testTimeoutMillis: 30000,
	}),
});
