import { expect } from "chai";
import { By, Key } from "selenium-webdriver";
import { Modal } from "./components/Modal";
import { selectFocusPreset } from "./components/OnboardingModal";
import { utils } from "./setup-selenium";
import path from "path";


describe("import/export", function() {
	this.timeout(30000);

	it("can import old", async () => {
		const filepath = path.resolve("tests/data/saves/mine.json");

		await selectFocusPreset();
		await utils.click(By.id("open-settings"));

		const modal = new Modal();
		modal.clickInside(By.id("tab-ImportExport"));
		utils.sendKeys(By.name("import-file"), filepath);
		await utils.sleep(500);

		await utils.noSuchElement(By.css(".modal"));
		expect(await utils.count(By.className("widget"))).to.eq(10);
		expect(await utils.count(By.className("error"))).to.eq(1);
	});
})
