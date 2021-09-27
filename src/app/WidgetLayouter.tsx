import { Rect2 } from "./utils/Rect2";
import { Vector2 } from "./utils/Vector2";
import { Widget } from "./Widget";


/**
 * Auto-boxes widgets into a dense layout.
 *
 * React-Grid-Layout only supports auto column placement.
 */
export default class WidgetLayouter {
	private rects: Rect2[] = [];

	/**
	 * @param grid_size Size of the grid. Y=0 if the grid has unlimited height
	 */
	constructor(private grid_size: Vector2) {}

	hasWidget(bounds: Rect2) {
		return this.rects.some(rect => rect.intersects(bounds));
	}

	addWidgetRect(rect: Rect2) {
		this.rects.push(rect);
	}

	private findFreePosition(size: Vector2): (Vector2 | undefined) {
		for (let y = 0; this.grid_size.y == 0 || y < this.grid_size.y - size.y + 1; y++) {
			for (let x = 0; x < this.grid_size.x - size.x + 1; x++) {
				const pos = new Vector2(x, y);
				if (!this.hasWidget(new Rect2(pos, size))) {
					return pos;
				}
			}
		}

		return undefined;
	}

	add(widget: Widget<unknown>) {
		if (!widget.position ||
				this.hasWidget(new Rect2(widget.position, widget.size))) {
			if (widget.position) {
				console.log(`Collision detected for ${widget.type} ${widget.id}, repositioning`);
				widget.position = undefined;
			}

			while (!widget.position) {
				widget.position = this.findFreePosition(widget.size);
				if (!widget.position) {
					if (widget.size.x > widget.size.y) {
						widget.size = widget.size.add(new Vector2(-1, 0));
					} else {
						widget.size = widget.size.add(new Vector2(0, -1));
					}
				}
			}
		}

		this.rects.push(new Rect2(widget.position, widget.size));
	}

	resolveAll(widgets: Widget<unknown>[]) {
		widgets.filter(widget => widget.position).forEach(this.add.bind(this));
		widgets.filter(widget => !widget.position).forEach(this.add.bind(this));
	}
}
