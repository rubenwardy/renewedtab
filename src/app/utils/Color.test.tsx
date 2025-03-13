import Color from "app/utils/Color";
import { assert } from "chai";

function C(r: number, g: number, b: number, a: number) {
	return new Color(r, g, b, a);
}

describe("Color", function() {
	it("parseString", function() {
		assert.deepEqual(Color.fromString("#336699"), C(51, 102, 153, 255));
		assert.deepEqual(Color.fromString("#996633"), C(153, 102, 51, 255));
		assert.deepEqual(Color.fromString("rgba(51, 102, 153, 255)"), C(51, 102, 153, 255));
	});

	it("hex", function() {
		assert.equal(C(51, 102, 153, 255).hex, "#336699");
	});

	it("rgba", function() {
		assert.equal(C(51, 102, 153, 255).rgba, "rgba(51, 102, 153, 255)");
	});
});
