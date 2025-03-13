import { Rect2 } from "app/utils/Rect2";
import { V } from "app/utils/Vector2";
import WidgetLayouter from "app/WidgetLayouter";
import { Widget } from "app/Widget";
import { expect } from "chai";

function R(x: number, y: number, w: number, h: number) {
	return new Rect2(V(x, y), V(w, h));
}

describe("WidgetLayouter", function() {
	it("cell cache works", function() {
		const layouter = new WidgetLayouter(V(15, 0));
		expect(layouter.hasWidget(R(1, 1, 1, 1))).to.be.false;
		expect(layouter.hasWidget(R(0, 0, 15, 15))).to.be.false;
		expect(layouter.hasWidget(R(5, 5, 3, 3))).to.be.false;
		expect(layouter.hasWidget(R(4, 4, 3, 3))).to.be.false;
		expect(layouter.hasWidget(R(3, 3, 3, 3))).to.be.false;
		expect(layouter.hasWidget(R(5, 6, 1, 1))).to.be.false;
		expect(layouter.hasWidget(R(6, 6, 1, 1))).to.be.false;
		layouter.addWidgetRect(R(6, 6, 3, 3));
		expect(layouter.hasWidget(R(1, 1, 1, 1))).to.be.false;
		expect(layouter.hasWidget(R(0, 0, 15, 15))).to.be.true;
		expect(layouter.hasWidget(R(5, 5, 3, 3))).to.be.true;
		expect(layouter.hasWidget(R(4, 4, 3, 3))).to.be.true;
		expect(layouter.hasWidget(R(3, 3, 3, 3))).to.be.false;
		expect(layouter.hasWidget(R(5, 6, 1, 1))).to.be.false;
		expect(layouter.hasWidget(R(6, 6, 1, 1))).to.be.true;
	});

	it("accepts existing", function() {
		const layouter = new WidgetLayouter(V(15, 0));

		const widget : Widget<any> = {
			id: 1,
			type: "Type",
			position: V(1, 1),
			size: V(3, 3),
			props: {},
			theme: {
				showPanelBG: false
			}
		};

		layouter.resolveAll([widget]);

		expect(widget.position).to.deep.equal(V(1, 1));
		expect(widget.size).to.deep.equal(V(3, 3));
	});

	it("finds position for new elements", function() {
		const layouter = new WidgetLayouter(V(15, 0));

		const widget1 : Widget<any> = {
			id: 1,
			type: "Type",
			size: V(3, 3),
			props: {},
			theme: {
				showPanelBG: false
			}
		};

		const widget2 : Widget<any> = {
			id: 1,
			type: "Type",
			size: V(15, 2),
			props: {},
			theme: {
				showPanelBG: false
			}
		};

		const widget3 : Widget<any> = {
			id: 1,
			type: "Type",
			size: V(3, 3),
			props: {},
			theme: {
				showPanelBG: false
			}
		};

		layouter.resolveAll([widget1, widget2, widget3]);
		expect(widget1.position).to.deep.equal(V(0, 0));
		expect(widget1.size).to.deep.equal(V(3, 3));
		expect(widget2.position).to.deep.equal(V(0, 3));
		expect(widget2.size).to.deep.equal(V(15, 2));
		expect(widget3.position).to.deep.equal(V(3, 0));
		expect(widget3.size).to.deep.equal(V(3, 3));
	});


	it("repositions existing positions on collision", function() {
		const layouter = new WidgetLayouter(V(15, 0));

		const widget1 : Widget<any> = {
			id: 1,
			type: "Type",
			size: V(3, 3),
			props: {},
			theme: {
				showPanelBG: false
			}
		};

		const widget2 : Widget<any> = {
			id: 1,
			type: "Type",
			position: V(0, 0),
			size: V(15, 2),
			props: {},
			theme: {
				showPanelBG: false
			}
		};

		const widget3 : Widget<any> = {
			id: 1,
			type: "Type",
			position: V(3, 0),
			size: V(3, 3),
			props: {},
			theme: {
				showPanelBG: false
			}
		};

		layouter.resolveAll([widget1, widget2, widget3]);
		expect(widget1.position).to.deep.equal(V(3, 2));
		expect(widget1.size).to.deep.equal(V(3, 3));
		expect(widget2.position).to.deep.equal(V(0, 0));
		expect(widget2.size).to.deep.equal(V(15, 2));
		expect(widget3.position).to.deep.equal(V(0, 2));
		expect(widget3.size).to.deep.equal(V(3, 3));
	});

	it("resizes if no available space", () => {
		const layouter = new WidgetLayouter(V(5, 3));
		const widgets: Widget<any>[] = [
			{
				id: 1,
				type: "Type",
				size: V(2, 3),
				props: {},
				theme: {
					showPanelBG: false
				}
			},
			{
				id: 2,
				type: "Type",
				size: V(3, 1),
				props: {},
				theme: {
					showPanelBG: false
				}
			},
			{
				id: 2,
				type: "Type",
				size: V(3, 3),
				props: {},
				theme: {
					showPanelBG: false
				}
			},
		];

		layouter.resolveAll(widgets);
		expect(widgets[0].position).to.deep.equal(V(0, 0));
		expect(widgets[0].size).to.deep.equal(V(2, 3));
		expect(widgets[1].position).to.deep.equal(V(2, 0));
		expect(widgets[1].size).to.deep.equal(V(3, 1));
		expect(widgets[2].position).to.deep.equal(V(2, 1));
		expect(widgets[2].size).to.deep.equal(V(3, 2));
	})
});
