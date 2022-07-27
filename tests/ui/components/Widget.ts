import { By, Locator, WebElement } from "selenium-webdriver";
import { driver, utils } from "../setup-selenium";


export class Widget {
	rootCSS: string;

	constructor(id_or_css: (string | number)) {
		if (typeof(id_or_css) == "string") {
			this.rootCSS = id_or_css;
		} else {
			this.rootCSS = `.widget[data-widget-id="${id_or_css}"]`;
		}
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

	async findElement(selector: Locator): Promise<WebElement> {
		const root = await this.getRoot();
		return await root.findElement(selector);
	}
}
