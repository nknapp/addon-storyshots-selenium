import initStoryshots from "@storybook/addon-storyshots";
import { reverseTunnel } from "./test-utils/reverse-tunnel";
import { imageSnapshot } from "../src";
import { storybookStaticServer } from "./test-utils/server";

// Storybook must already be running on port 9009
const remoteTunnelPort = 9009;
const storybookPort = 9009;

const tunnel = reverseTunnel({
	host: process.env.SELENIUM_HOST || "localhost",
	tunnelSpec: `R:${remoteTunnelPort}:localhost:${storybookPort}`,
});

beforeAll(async () => tunnel.start());
afterAll(async () => tunnel.stop());

const server = storybookStaticServer(storybookPort);
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
