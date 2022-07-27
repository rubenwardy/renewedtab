import { By, Locator, WebElement } from "selenium-webdriver";
import { utils } from "../setup-selenium";

export class Modal {
	getRoot(): Promise<WebElement> {
		return utils.findElement(By.className("modal"));
	}

	getFooter(): Promise<WebElement> {
		return utils.findElement(By.className("modal-footer"));
	}

	async close(): Promise<void> {
		await utils.click(By.css(".modal .modal-close"));
	}

	async clickInside(selector: By) {
		await utils.clickInside(await this.getRoot(), selector);
	}

	async clickFooter(selector: By): Promise<void> {
		await utils.clickInside(await this.getFooter(), selector);
	}

	async count(selector: By): Promise<number> {
		return await utils.countInside(await this.getRoot(), selector)
	}

	async findElement(selector: Locator): Promise<WebElement> {
		const root = await this.getRoot();
		return await root.findElement(selector);
	}
}
