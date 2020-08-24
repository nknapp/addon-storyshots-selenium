import { Session, WebDriver } from "selenium-webdriver";
import { BrowserSpecification } from "../../types";
import { Browser } from "../browser";

export const pixelGraphic = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
	"base64"
);

export const mockWebdriver = new WebDriver(
	new Promise<Session>(() => {
		// We actually only need the webdriver as an object to pass around.
		// Therefore we don't need an existing session. In order to
		// avoid unnecessary work, we just never resolve this promise.
	}),
	{
		defineCommand: jest.fn(),
		execute: jest.fn(),
	}
);

mockWebdriver.toString = () => "mockWebdriver";
mockWebdriver["toJSON"] = () => "mockWebdriver";
mockWebdriver["inspect"] = () => "mockWebdriver";

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
		quit: jest.fn().mockReturnValue(Promise.resolve()),
		getCurrentUrl: jest.fn(),
	};
}

export const createBrowser = jest.fn();
