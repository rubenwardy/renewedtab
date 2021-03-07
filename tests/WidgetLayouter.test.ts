import { V } from "app/utils/Vector2";
import WidgetLayouter from "app/WidgetLayouter";
import { WidgetRaw } from "app/WidgetManager";
import { expect } from "chai";

describe("WidgetLayouter", function() {
	it("cell cache works", function() {
		const layouter = new WidgetLayouter(V(15, 15));
		expect(layouter.hasWidget(V(1, 1), V(1, 1))).to.be.false;
		expect(layouter.hasWidget(V(0, 0), V(15, 15))).to.be.false;
		expect(layouter.hasWidget(V(5, 5), V(3, 3))).to.be.false;
		expect(layouter.hasWidget(V(4, 4), V(3, 3))).to.be.false;
		expect(layouter.hasWidget(V(3, 3), V(3, 3))).to.be.false;
		expect(layouter.hasWidget(V(5, 6), V(1, 1))).to.be.false;
		expect(layouter.hasWidget(V(6, 6), V(1, 1))).to.be.false;
		layouter.setHasWidget(V(6, 6), V(3, 3), true);
		expect(layouter.hasWidget(V(1, 1), V(1, 1))).to.be.false;
		expect(layouter.hasWidget(V(0, 0), V(15, 15))).to.be.true;
		expect(layouter.hasWidget(V(5, 5), V(3, 3))).to.be.true;
		expect(layouter.hasWidget(V(4, 4), V(3, 3))).to.be.true;
		expect(layouter.hasWidget(V(3, 3), V(3, 3))).to.be.false;
		expect(layouter.hasWidget(V(5, 6), V(1, 1))).to.be.false;
		expect(layouter.hasWidget(V(6, 6), V(1, 1))).to.be.true;
	});

	it("accepts existing", function() {
		const layouter = new WidgetLayouter(V(15, 15));

		const widget : WidgetRaw<any> = {
			id: 1,
			type: "Type",
			position: V(1, 1),
			size: V(3, 3),
			props: {}
		};

		layouter.resolveAll([widget]);

		expect(widget.position).to.deep.equal(V(1, 1));
		expect(widget.size).to.deep.equal(V(3, 3));
	});

	it("finds position for new elements", function() {

		const layouter = new WidgetLayouter(V(15, 15));

		const widget1 : WidgetRaw<any> = {
			id: 1,
			type: "Type",
			size: V(3, 3),
			props: {}
		};

		const widget2 : WidgetRaw<any> = {
			id: 1,
			type: "Type",
			size: V(15, 2),
			props: {}
		};

		const widget3 : WidgetRaw<any> = {
			id: 1,
			type: "Type",
			size: V(3, 3),
			props: {}
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

		const layouter = new WidgetLayouter(V(15, 15));

		const widget1 : WidgetRaw<any> = {
			id: 1,
			type: "Type",
			size: V(3, 3),
			props: {}
		};

		const widget2 : WidgetRaw<any> = {
			id: 1,
			type: "Type",
			position: V(0, 0),
			size: V(15, 2),
			props: {}
		};

		const widget3 : WidgetRaw<any> = {
			id: 1,
			type: "Type",
			position: V(3, 0),
			size: V(3, 3),
			props: {}
		};

		layouter.resolveAll([widget1, widget2, widget3]);
		expect(widget1.position).to.deep.equal(V(3, 2));
		expect(widget1.size).to.deep.equal(V(3, 3));
		expect(widget2.position).to.deep.equal(V(0, 0));
		expect(widget2.size).to.deep.equal(V(15, 2));
		expect(widget3.position).to.deep.equal(V(0, 2));
		expect(widget3.size).to.deep.equal(V(3, 3));
	});
});
