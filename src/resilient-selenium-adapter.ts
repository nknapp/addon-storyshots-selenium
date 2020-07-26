import { BrowserSpecification } from "./types";
import webdriver, { error, WebDriver } from "selenium-webdriver";
import createDebug from "debug";
import { createSectionDebug } from "./utils/internal-utils";

type WebDriverError = error.WebDriverError;
const WebDriverError = error.WebDriverError;

const debug = createDebug("addon-storyshots-selenium:resilient-selenium-adapter");
const sectionDebug = createSectionDebug(debug);

export class ResilientSeleniumAdapter {
	private readonly browser: BrowserSpecification;
	private readonly seleniumUrl: string;
	private driver?: WebDriver;
	private readonly retries;
	public readonly browserId: string;

	constructor(seleniumUrl: string, browser: BrowserSpecification) {
		this.seleniumUrl = seleniumUrl;
		this.browser = browser;
		this.browserId = browser.id;
		this.retries = 3;
	}

	async doWithRetries<R>(fn: (driver: WebDriver) => Promise<R>): Promise<R> {
		if (!this.driver) {
			this.driver = this.createDriver();
		}

		let lastError: WebDriverError | null = null;
		for (let i = 1; i <= this.retries; i++) {
			try {
				return await sectionDebug(`execute function (attempt ${i})`, () => fn(this.driver));
			} catch (error) {
				if (!(error instanceof WebDriverError)) {
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
		return new webdriver.Builder()
			.usingServer(this.seleniumUrl)
			.withCapabilities(this.browser.capabilities)
			.build();
	}

	public async close(): Promise<void> {
		if (this.driver) {
			await sectionDebug(`Stopping driver for "${this.browserId}"`, () => this.driver.quit());
			this.driver = null;
		}
	}
}
