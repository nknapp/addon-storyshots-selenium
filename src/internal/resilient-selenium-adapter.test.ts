import { ResilientSeleniumAdapter } from "./resilient-selenium-adapter";

describe("the resilient-selenium-adapter", () => {
	let adapter: ResilientSeleniumAdapter | null = null;

	beforeAll(() => {
		adapter = new ResilientSeleniumAdapter("http://localhost:24444/wd/hub", {
			id: "firefox",
			capabilities: {
				browserName: "firefox",
			},
		});
	});

	afterAll(async () => {
		if (adapter != null) {
			await adapter.close();
		}
	});

	it("should recreate the webdriver", async () => {
		let counter = 0;
		const result = await adapter.doWithRetries(async (driver) => {
			counter++;
			if (counter < 2) {
				await driver.quit();
			}
			return await driver.executeScript("return 5+6;");
		});
		expect(counter).toEqual(2);
		expect(result).toEqual(11);
	}, 60000);
});
