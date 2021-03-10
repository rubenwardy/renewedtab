import { Rect2 } from "./utils/Rect2";
import { Vector2 } from "./utils/Vector2";
import { WidgetRaw } from "./WidgetManager";


/**
 * Auto-boxes widgets into a dense layout.
 *
 * React-Grid-Layout only supports auto column placement.
 */
export default class WidgetLayouter {
	private rects: Rect2[] = [];

	constructor(private grid_size: Vector2) {}

	hasWidget(bounds: Rect2) {
		return this.rects.some(rect => rect.intersects(bounds));
	}

	addWidgetRect(rect: Rect2) {
		this.rects.push(rect);
	}

	private findFreePosition(size: Vector2): Vector2 {
		for (let y = 0;; y++) {
			for (let x = 0; x < this.grid_size.x - size.x + 1; x++) {
				const pos = new Vector2(x, y);
				if (!this.hasWidget(new Rect2(pos, size))) {
					return pos;
				}
			}
		};
	}

	add(widget: WidgetRaw<any>) {
		if (!widget.position ||
				this.hasWidget(new Rect2(widget.position, widget.size))) {
			if (widget.position) {
				console.log(`Collision detected for ${widget.type} ${widget.id}, repositioning`);
			}
			widget.position = this.findFreePosition(widget.size);
		}

		this.rects.push(new Rect2(widget.position, widget.size));
	}

	resolveAll(widgets: WidgetRaw<any>[]) {
		widgets.filter(widget => widget.position).forEach(this.add.bind(this));
		widgets.filter(widget => !widget.position).forEach(this.add.bind(this));
	}
}
