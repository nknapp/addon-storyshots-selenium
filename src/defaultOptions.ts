import { OptionalImageSnapshotOptions, StorybookContext, WidthAndHeight } from "./types";
import { doNothing, waitMillis } from "./utils/public-utils";
import path from "path";
import { MatchImageSnapshotOptions } from "jest-image-snapshot";

export const defaultOptions: OptionalImageSnapshotOptions = {
	sizes: ["1024x768"],
	storybookUrl: "http://localhost:6006",
	beforeFirstScreenshot: waitMillis(1000),
	beforeEachScreenshot: waitMillis(200),
	afterEachScreenshot: doNothing(),
	getMatchOptions: doNothing(),
	snapshotBaseDirectory: path.join("src", "__image_snapshots_selenium__"),
	seleniumUrl: process.env.SELENIUM_URL || "http://localhost:4444/wd/hub",
	testTimeoutMillis: 60000,
	setupTimeoutMillis: 60000,
	teardownTimeoutMillis: 60000,
};

export function getDefaultMatchOptions(
	snapshotBaseDirectory: string,
	context: StorybookContext,
	size: WidthAndHeight,
	browserId: string
): MatchImageSnapshotOptions {
	return {
		customSnapshotsDir: path.join(snapshotBaseDirectory, context.story.id),
		customSnapshotIdentifier: `${context.story.id}-${size}-${browserId}`,
	};
}
