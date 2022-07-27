import { expect } from "chai";
import { By, Key } from "selenium-webdriver";
import App from "../components/App";
import { Modal } from "../components/Modal";
import { selectFocusPreset } from "../components/OnboardingModal";
import { utils } from "../setup-selenium";


describe("Weather", function() {
	this.timeout(30000);

	it("set location", async () => {
		await selectFocusPreset();

		const app = new App();
		expect(await app.getNumberOfWidgets()).to.eq(2);
		const widget = await app.createWidget("Weather");

		await utils.elementTextContains(By.css(".location.weather-title a"), "Bristol");
		await widget.edit();

		const modal = new Modal();
		expect(await modal.count(By.className("field"))).to.eq(19);
		await modal.clickInside(By.css(".field-location button"));

		const query = await utils.findElement(
			By.css(".field-group input[type='text']"));
		await query.sendKeys("Paris", Key.ENTER);

		const optionLocator = By.css(".modal .locations > li:nth-child(1) > a");
		await utils.elementTextContains(optionLocator, "Paris");
		const option = await utils.findElement(optionLocator);
		option.click();

		await modal.close();

		await utils.elementTextContains(By.css(".location.weather-title a"), "Paris");
	})
});
