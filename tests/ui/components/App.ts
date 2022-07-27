import { expect } from "chai";
import { By } from "selenium-webdriver";
import { utils } from "../setup-selenium";
import { Widget } from "./Widget";


export default class App {
	async getNumberOfWidgets(): Promise<number> {
		return await utils.count(By.className("widget"));
	}

	getWidgetById(id: number) {
		return new Widget(id);
	}

	async createWidget(type: string): Promise<Widget> {
		const count = await this.getNumberOfWidgets();
		await utils.click(By.id("add-widget"));
		await utils.click(By.css(`li[data-widget-type="${type}"] a`));

		const newCount = await this.getNumberOfWidgets();
		expect(newCount).to.eq(count + 1);

		const widgets = await this.getWidgetsByType(type);
		return widgets[widgets.length - 1];
	}

	async getWidgetsByType(type: string): Promise<Widget[]> {
		const widgets = await utils.findElements(
			By.css(`.widget.widget-${type.toLowerCase()}`));

		const ids = await Promise.all(widgets.map(x => x.getAttribute("data-widget-id")));
		return ids.map(x => new Widget(parseInt(x)));
	}

	async getWidgetByType(type: string): Promise<Widget> {
		const widgets = await this.getWidgetsByType(type);
		expect(widgets.length).to.eq(1);
		return widgets[0];
	}
}
