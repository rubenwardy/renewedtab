import { LinkBoxProps } from "app/components/LinkBox";
import { Vector2 } from "app/utils/Vector2";
import { ListBoxStyle } from "app/Widget";
import { WidgetManager } from "app/WidgetManager";
import { expect } from "chai";
import DummyStorage from "./DummyStorage";

const NUM_LINKS = 5;

describe("WidgetManager::create", () => {
	it("createsDefaultWidgets", async () => {
		const storage = new DummyStorage();
		const wm = new WidgetManager(storage);
		await wm.load();
		expect(wm.widgets.length).to.equal(0);
	});

	it("copiesProps", async () => {
		const storage = new DummyStorage();
		storage.set("widgets", [
			{
				id: "123",
				type: "Notes",
				props: {},
				size: new Vector2(3, 5),
			},
		]);

		const wm = new WidgetManager(storage);
		expect(wm.widgets.length).to.equal(0);
		await wm.load();
		expect(wm.widgets.length).to.equal(1);

		const widget1 = wm.createWidget<LinkBoxProps>("Links");
		const widget2 = wm.createWidget<LinkBoxProps>("Links");
		expect(widget1.props.links.length).to.equal(NUM_LINKS);
		expect(widget2.props.links.length).to.equal(NUM_LINKS);

		widget1.props.links.push({
			id: "123",
			title: "Title",
			url: "url",
		});

		expect(widget1.props.links.length).to.equal(NUM_LINKS + 1);
		expect(widget2.props.links.length).to.equal(NUM_LINKS);
	});

	it("copiesTheme", async () => {
		const storage = new DummyStorage();
		storage.set("widgets", []);
		const wm = new WidgetManager(storage);
		await wm.load();
		expect(wm.widgets.length).to.equal(0);

		const widget1 = wm.createWidget<LinkBoxProps>("Links");
		const widget2 = wm.createWidget<LinkBoxProps>("Links");
		expect(widget1.theme.listBoxStyle).is.eq(ListBoxStyle.Vertical);
		widget1.theme.listBoxStyle = ListBoxStyle.Icons;
		expect(widget1.theme.listBoxStyle).is.eq(ListBoxStyle.Icons);
		expect(widget2.theme.listBoxStyle).is.eq(ListBoxStyle.Vertical);
	});
});


describe("WidgetManager::load", () => {
	it("adds theme", async () => {
		const storage = new DummyStorage();
		storage.set("widgets", [
			{
				id: "123",
				type: "Notes",
				props: {},
				size: new Vector2(3, 5),
			},
			{
				id: "124",
				type: "Clock",
				props: {},
				size: new Vector2(3, 5),
			},
		]);

		const wm = new WidgetManager(storage);
		expect(wm.widgets.length).to.equal(0);
		await wm.load();
		expect(wm.widgets.length).to.equal(2);

		{
			const notesWidget = wm.widgets[0];
			expect(notesWidget.theme).not.null;
			expect(notesWidget.theme.showPanelBG).to.be.true;
		}

		{
			const clockWidget = wm.widgets[1];
			expect(clockWidget.theme).not.null;
			expect(clockWidget.theme.showPanelBG).to.be.false;
		}
	});

	it("runs load hook", async () => {
		const storage = new DummyStorage();
		storage.set("widgets", [
			{
				id: "123",
				type: "TopSites",
				props: {
					useIconBar: false,
				},
				size: new Vector2(3, 5),
			},
		]);

		const wm = new WidgetManager(storage);
		expect(wm.widgets.length).to.equal(0);
		await wm.load();
		expect(wm.widgets.length).to.equal(1);

		const widget = wm.widgets[0];
		expect(widget.props).not.to.haveOwnProperty("useIconBar");
		expect(widget.theme).not.null;
		expect(widget.theme.showPanelBG).to.be.true;
		expect(widget.theme.listBoxStyle).to.eq(ListBoxStyle.Vertical);
	});
});
