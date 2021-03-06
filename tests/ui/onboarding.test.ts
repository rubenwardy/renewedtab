import { expect } from "chai";
import { By } from "selenium-webdriver";
import { utils } from "./setup-selenium";


describe("Onboarding", function() {
	this.timeout(30000);

	it("onboarding presets", async () => {
		await utils.elementTextContains(
			By.css(".modal-header h2"), "Welcome to Renewed Tab");

		await utils.click(By.css(".carousel-next"));
		await utils.elementTextContains(
			By.css(".modal-body h3"), "Drag and Drop Widgets");

		await utils.click(By.css(".carousel-next"));
		await utils.elementTextContains(
			By.css(".modal-body h3"), "Choose a Starting Point");

		await utils.click(By.css(".presets li:first-child a"));

		await utils.noSuchElement(By.css(".modal"));

		await utils.sleep(1000);

		expect(await utils.count(By.className("widget"))).to.eq(2);
	});
});
