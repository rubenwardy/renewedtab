import webdriver, { By, until } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";
import chrome from "selenium-webdriver/chrome";
import UITestUtils from "./UITestUtils";

export let driver: webdriver.WebDriver;
export let utils: UITestUtils;


before(async () => {
	const chromeOptions = new chrome.Options();
	chromeOptions.addArguments("--load-extension=dist/webext/");

	driver = new webdriver.Builder()
		.forBrowser("chrome")
		.setChromeOptions(chromeOptions)
		.build();
	utils = new UITestUtils(driver);

	if (driver instanceof chrome.Driver) {
		await driver.get("chrome://newtab/");
	} else if (driver instanceof firefox.Driver) {
		const ffdriver = driver as firefox.Driver;
		await ffdriver.installAddon("web-ext-artifacts/firefox.zip", true);
		await driver.switchTo().newWindow("tab");
		await utils.sleep(1500);
	} else {
		throw new Error("Unknown selenium driver");
	}
});


beforeEach(async () => {
	// Clear data and reload extension between each test
	await driver.executeAsyncScript(`
		(async () => {
			localStorage.clear();
			await browser.storage.local.clear();
			await browser.storage.sync.clear();

			// Resolve():
			arguments[arguments.length - 1]();
		})();
	`);
	await driver.navigate().refresh();
});


after(() => driver.quit());
