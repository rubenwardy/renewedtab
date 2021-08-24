import webdriver from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";
import chrome from "selenium-webdriver/chrome";
import { Command } from "selenium-webdriver/lib/command";
import path from "path";

import UITestUtils from "./UITestUtils";

export let driver: webdriver.WebDriver;
export let utils: UITestUtils;


before(async function() {
	this.timeout(30000);

	const extensionPath = path.resolve("./dist/webext/");

	const chromeOptions = new chrome.Options();
	chromeOptions.addArguments(`--load-extension=${extensionPath}`);

	driver = new webdriver.Builder()
		.forBrowser("chrome")
		.setChromeOptions(chromeOptions)
		.build();
	utils = new UITestUtils(driver);

	if (driver instanceof chrome.Driver) {
		await driver.get("chrome://newtab/");
	} else if (driver instanceof firefox.Driver) {
		const command = new Command("install addon")
			.setParameter("path", extensionPath)
			.setParameter("temporary", true);
		await driver.execute(command);

		await driver.switchTo().newWindow("tab");
		await utils.sleep(1500);
	} else {
		throw new Error("Unknown selenium driver");
	}
});


beforeEach(async () => {
	// Clear data and reload extension between each test
	await driver.executeAsyncScript(`
		const resolve = arguments[arguments.length - 1];
		(async () => {
			localStorage.clear();
			await browser.storage.local.clear();
			await browser.storage.sync.clear();
			resolve();
		})();
	`);
	await driver.navigate().refresh();
});


after(async function() {
	this.timeout(30000);
	driver.quit();
});
