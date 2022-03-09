import { By } from "selenium-webdriver";
import { utils } from "../setup-selenium";

export async function selectFocusPreset() {
	await utils.click(By.css(".carousel-next"));
	await utils.click(By.css(".carousel-next"));
	await utils.click(By.css(".presets li:first-child a"));
	await utils.noSuchElement(By.css(".modal"));
	await utils.sleep(1000);
}
