import { BrowserSpecification } from "./types";
import webdriver, { error, WebDriver } from "selenium-webdriver";
import createDebug from "debug";
import { waitMillis } from "./utils";

type WebDriverError = error.WebDriverError;
const WebDriverError = error.WebDriverError;

const debug = createDebug("addon-storyshot-selenium:resilient-selenium-adapter");

export class ResilientSeleniumAdapter {
	private readonly browser: BrowserSpecification;
	private readonly seleniumUrl: string;
	private driver?: WebDriver;
	private readonly retries;
	private executionSinceRecreate: number;
	public readonly browserId: string;

	constructor(seleniumUrl: string, browser: BrowserSpecification) {
		this.seleniumUrl = seleniumUrl;
		this.browser = browser;
		this.browserId = browser.id;
		this.retries = 3;
		this.executionSinceRecreate = 0;
	}

	async doWithRetries<R>(fn: (driver: WebDriver) => Promise<R>): Promise<R> {
		if (!this.driver) {
			this.driver = this.createDriver();
		}
		this.executionSinceRecreate++;
		// if (this.executionSinceRecreate > 3) {
		// 	debug(`Recreating after ${this.executionSinceRecreate} executions, just to be sure.`)
		// 	await this.recreateDriver();
		// }

		let lastError: WebDriverError | null = null;
		for (let i = 1; i <= this.retries; i++) {
			debug(`Executing function (${i}time)`);
			try {
				const result = await fn(this.driver);
				debug(`Done executing function (${i}time)`);
				return result;
			} catch (error) {
				if (!(error instanceof WebDriverError)) {
					debug("Non-WebdriverError found", error);
					throw error;
				}
				debug("WebdriverError found, retrying soon", error);
				lastError = error;
				await this.recreateDriver();
			}
		}
		throw lastError;
	}

	private async recreateDriver() {
		debug(`Recreating webdriver for browser ${this.browser.id}`);
		await this.closeQuietly();
		//	await waitMillis(11000)();
		this.driver = this.createDriver();
		debug(`Done recreating webdriver for browser ${this.browser.id}`);
	}

	private async closeQuietly() {
		debug(`Closing webdriver for browser ${this.browser.id}`);
		try {
			await this.close();
			debug(`Done closing webdriver for browser ${this.browser.id}`);
		} catch (error) {
			debug(`Done closing webdriver for browser ${this.browser.id}`, error);
		}
	}

	private createDriver() {
		this.executionSinceRecreate = 0;
		return new webdriver.Builder()
			.usingServer(this.seleniumUrl)
			.withCapabilities(this.browser.capabilities)
			.build();
	}

	public async close(): Promise<void> {
		if (this.driver) {
			debug(`Stopping driver for "${this.browserId}"`);
			await this.driver.quit();
			debug(`Done stopping driver for "${this.browserId}"`);
			this.driver = null;
		}
	}
}
