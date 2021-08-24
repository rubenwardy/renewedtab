import { expect } from "chai";
import { By } from "selenium-webdriver";
import { Modal } from "./components/Modal";
import { Widget } from "./components/Widget";
import { driver, utils } from "./setup-selenium";


describe("Widget", function() {
	this.timeout(30000);

	it("can delete", async () => {
		await utils.click(By.css(".carousel-next"));
		await utils.click(By.css(".carousel-next"));
		await utils.click(By.css(".presets li:first-child a"));
		await utils.noSuchElement(By.css(".modal"));
		await utils.sleep(1000);

		expect(await utils.count(By.className("widget"))).to.eq(2);

		const widget = new Widget(1);
		await widget.delete();

		const modal = new Modal();
		modal.clickFooter(By.className("btn-danger"));
		await utils.noSuchElement(By.css(".modal"));

		expect(await utils.count(By.className("widget"))).to.eq(1);
		await widget.noSuchElement();
	});

	it("can edit", async () => {
		await utils.click(By.css(".carousel-next"));
		await utils.click(By.css(".carousel-next"));
		await utils.click(By.css(".presets li:first-child a"));
		await utils.noSuchElement(By.css(".modal"));
		await utils.sleep(1000);

		expect(await utils.count(By.className("widget"))).to.eq(2);

		const widget = new Widget(2);
		await widget.edit();

		const modal = new Modal();
		expect(await modal.count(By.className("field"))).to.eq(2);

		await modal.clickInside(By.css(`.form:first-child input[type="checkbox"]`));
		expect(await modal.count(By.className("field"))).to.eq(4);
	})
});
