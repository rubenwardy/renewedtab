import { By, WebElement } from "selenium-webdriver";
import { driver, utils } from "../setup-selenium";


export class Widget {
	constructor(readonly id: number) {}

	get rootCSS() {
		return `.widget[data-widget-id="${this.id}"]`;
	}

	getRoot(): Promise<WebElement> {
		return utils.findElement(By.css(this.rootCSS));
	}

	async edit(): Promise<void> {
		await this.hover();
		await utils.clickInside(await this.getRoot(), By.className("widget-edit"));
	}

	async delete(): Promise<void> {
		await this.hover();
		await utils.clickInside(await this.getRoot(), By.className("widget-delete"));
	}

	async noSuchElement(): Promise<void> {
		await utils.noSuchElement(By.css(this.rootCSS));
	}

	async hover(): Promise<void> {
		await driver.executeScript(`
			document.querySelectorAll(".widget.fake").forEach(el => el.classList.remove("fake"));
			document.querySelector('${this.rootCSS}').classList.add("fake");
		`);
	}
}
