import initStoryshots from "@storybook/addon-storyshots";
import { reverseTunnel } from "./test-utils/reverse-tunnel";
import { imageSnapshot } from "../src";
import { storybookStaticServer } from "./test-utils/server";

const REMOTE_TUNNEL_PORT = 9009;
const STORYBOOK_PORT = 9009;

// This configuration uses chisel to connect to a chisel-server in the docker-selenium container
// in order to create a tunnel a tunnel from the docker-selenium-server to localhost
// The browser then connects to the start of the tunnel (REMOTE_TUNNEL_PORT) which is
// forwarded to the local STORYBOOK_PORT.
//
// * The selenium docker-container must be started. Have a look at the docker-compose.yml
//   in this repo. The used image supports firefox and chrome.
// * `yarn build-storybook` must have been executed before running the tests.
// * `yarn build-storybook -w ` can be used in development to rebuild storybook on changes.
//
//
const tunnel = reverseTunnel({
	host: process.env.SELENIUM_HOST || "localhost",
	tunnelSpec: `R:${REMOTE_TUNNEL_PORT}:localhost:${STORYBOOK_PORT}`,
});

beforeAll(async () => tunnel.start());
afterAll(async () => tunnel.stop());

const server = storybookStaticServer(STORYBOOK_PORT);
beforeAll(async () => server.start());
afterAll(async () => server.stop());

initStoryshots({
	framework: "html",
	suite: "All",
	test: imageSnapshot({
		sizes: ["1280x1024", "1024x768", "800x600", "320x640"],
		browsers: [
			{
				id: "chrome",
				capabilities: {
					browserName: "chrome",
				},
			},
			{
				id: "firefox",
				capabilities: {
					browserName: "firefox",
				},
			},
		],
		seleniumUrl: "http://localhost:24444/wd/hub",
		storybookUrl: "http://localhost:9009",
		snapshotBaseDirectory: __filename + "-snapshots",
	}),
});
