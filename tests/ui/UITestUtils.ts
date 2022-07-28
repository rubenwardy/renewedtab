
import webdriver, { Locator, until, WebElement } from "selenium-webdriver";

export type ElementOrLocator = Locator | WebElement;

const TIMEOUT = 10000;

export default class UITestUtils {
	constructor(private readonly driver: webdriver.WebDriver) {}

	async findElement(locator: Locator): Promise<WebElement> {
		return await this.driver.wait(until.elementLocated(locator), TIMEOUT);
	}

	async findElements(locator: Locator): Promise<WebElement[]> {
		return await this.driver.findElements(locator);
	}

	async click(locator: ElementOrLocator): Promise<void> {
		const btn = await this.resolveElement(locator);
		await btn.click();
	}

	async clickInside(element: ElementOrLocator, locator: Locator) {
		const resolved = await this.resolveElement(element);
		const btn = await resolved.findElement(locator);
		await btn.click();
	}

	async elementTextContains(selector: ElementOrLocator, value: string): Promise<void> {
		const element = await this.resolveElement(selector);
		await this.driver.wait(until.elementTextContains(element, value), TIMEOUT);
	}

	async noSuchElement(locator: Locator): Promise<void> {
		await this.sleep(500);
		const impl = async () =>
			(await this.driver.findElements(locator)).length == 0;

		await this.driver.wait(impl, TIMEOUT);
	}

	async count(locator: Locator): Promise<number> {
		return (await this.driver.findElements(locator)).length
	}

	async countInside(element: ElementOrLocator, locator: Locator): Promise<number> {
		const resolved = await this.resolveElement(element);
		return (await resolved.findElements(locator)).length;
	}

	async sendKeys(locator: Locator, ...text: (string | number)[]): Promise<void> {
		const element = await this.resolveElement(locator);
		await element.sendKeys(...text);
	}

	sleep(ms: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	private async resolveElement(locator: ElementOrLocator):
			Promise<webdriver.WebElement> {
		if (locator instanceof WebElement) {
			return locator;
		} else {
			return await this.findElement(locator);
		}
	}
}
