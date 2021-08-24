
import webdriver, { By, until, WebElement } from "selenium-webdriver";

export type ElementOrSelector = By | WebElement;

const TIMEOUT = 5000;

export default class UITestUtils {
	constructor(private readonly driver: webdriver.WebDriver) {}

	async findElement(selector: By): Promise<WebElement> {
		return await this.driver.wait(until.elementLocated(selector), TIMEOUT);
	}

	async click(selector: ElementOrSelector): Promise<void> {
		const btn = await this.resolveElement(selector);
		await btn.click();
	}

	async clickInside(element: ElementOrSelector, selector: By) {
		const resolved = await this.resolveElement(element);
		const btn = await resolved.findElement(selector);
		await btn.click();
	}

	async elementTextContains(selector: ElementOrSelector, value: string): Promise<void> {
		const element = await this.resolveElement(selector);
		await this.driver.wait(until.elementTextContains(element, value), TIMEOUT);
	}

	async noSuchElement(selector: By): Promise<void> {
		await this.sleep(500);
		const impl = async () =>
			(await this.driver.findElements(selector)).length == 0;

		await this.driver.wait(impl, TIMEOUT);
	}

	async count(selector: By): Promise<number> {
		return (await this.driver.findElements(selector)).length
	}

	async countInside(element: ElementOrSelector, selector: By): Promise<number> {
		const resolved = await this.resolveElement(element);
		return (await resolved.findElements(selector)).length;
	}

	sleep(ms: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	private async resolveElement(selector: ElementOrSelector):
			Promise<webdriver.WebElement> {
		if (selector instanceof By) {
			return await this.findElement(selector);
		} else {
			return selector;
		}
	}
}
