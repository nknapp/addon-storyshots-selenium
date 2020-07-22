import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "../src/index";
import browserstack from "browserstack-local";

const browserstackLocal = new browserstack.Local();
const { promisify } = require("util");

browserstackLocal.startPromised = promisify(browserstackLocal.start);
browserstackLocal.stopPromised = promisify(browserstackLocal.stop);

beforeAll(async () => browserstackLocal.startPromised({ key: "" }));
afterAll(async () => browserstackLocal.stopPromised());

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
					browserstack: {
						local: true,
					},
				},
			},
		],
		storybookUrl: "http://localhost:9009",
		snapshotDirectory: __filename + "-snapshots",
	}),
});
