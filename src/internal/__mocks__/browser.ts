import { Session, WebDriver } from "selenium-webdriver";
import { BrowserSpecification } from "../../types";
import { Browser } from "../browser";

const pixelGraphic = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
	"base64"
);

const mockWebdriver = new WebDriver(
	new Promise<Session>(() => {
		/* empty mock */
	}),
	{
		defineCommand: jest.fn(),
		execute: jest.fn(),
	}
);

export function createBrowserMockImplementation(
	seleniumUrl: string,
	browser: BrowserSpecification
): Browser {
	return {
		driver: mockWebdriver,
		id: browser.id,
		prepareBrowser: jest.fn().mockReturnValue(Promise.resolve()),
		resizeTo: jest.fn().mockReturnValue(Promise.resolve()),
		takeScreenshot: jest.fn().mockReturnValue(Promise.resolve(pixelGraphic)),
		close: jest.fn().mockReturnValue(Promise.resolve()),
		getCurrentUrl: jest.fn(),
	};
}

export const createBrowser = jest.fn();
