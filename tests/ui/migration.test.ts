import { expect } from "chai";
import { By } from "selenium-webdriver";
import { driver, utils } from "./setup-selenium";


describe.skip("Migration", function() {
	this.timeout(30000);

	it("migration to sync", async () => {
		await utils.findElement(By.css(".onboarding"));
		await utils.elementTextContains(
			By.css("h2.modal-header"), "Welcome to Renewed Tab");

		await driver.executeAsyncScript(`
			const resolve = arguments[arguments.length - 1];
			(async () => {
				localStorage.clear();
				await browser.storage.sync.clear();

				await browser.storage.local.set({
					"widgets": [
						{
							"id": 1,
							"type": "Quotes",
							"position": {
								"__type__": "vec2",
								"x": 0,
								"y": 11
							},
							"size": {
								"__type__": "vec2",
								"x": 15,
								"y": 3
							},
							"props": {
								"categories": {
									"inspire": true,
									"life": true,
									"love": true,
									"funny": false
								}
							},
							"theme": {
								"showPanelBG": false,
								"textColor": "#ffffff"
							}
						}
					]
				});
				resolve();
			})();
		`);
		await driver.navigate().refresh();

		await utils.sleep(500);
		await utils.noSuchElement(By.css(".modal"));

		const widgets = await driver.findElements(By.css(".widget"));
		expect(widgets.length).to.eq(1);
		expect(await widgets[0].getAttribute("class")).to.include("widget-quotes");
		await utils.noSuchElement(By.css(".error"));

		const data = await driver.executeAsyncScript<any>(`
			const resolve = arguments[arguments.length - 1];
			resolve(browser.storage.sync.get());
		`);

		expect(data).to.not.be.null;
		expect(data.widgets.length).to.eq(1);
		expect(data.widgets[0].id).to.eq(1);
		expect(data.widgets[0].type).to.eq("Quotes");
		expect(data["widgets-1"]).to.not.be.null;
	});
});
