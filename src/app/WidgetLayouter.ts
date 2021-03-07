import { Vector2 } from "./utils/Vector2";
import { WidgetRaw } from "./WidgetManager";

export default class WidgetLayouter {
	/** Whether position contains a widget */
	private cellCache: boolean[][] = [];

	constructor(private grid_size: Vector2) {
		this.clearCache();
	}

	private clearCache() {
		for (let y = 0; y < this.grid_size.y; y++) {
			const row: boolean[] = [];
			this.cellCache.push(row);
			for (let x = 0; x < this.grid_size.x; x++) {
				row.push(false);
			}
		}
	}

	hasWidget(from: Vector2, size: Vector2) {
		for (let y = from.y; y < from.y + size.y && y < this.grid_size.y; y++) {
			const row = this.cellCache[y];
			for (let x = from.x; x < from.x + size.x && x < this.grid_size.x; x++) {
				if (row[x]) {
					return true;
				}
			}
		}
		return false;
	}

	setHasWidget(from: Vector2, size: Vector2, val: boolean) {
		for (let y = from.y; y < from.y + size.y && y < this.grid_size.y; y++) {
			const row = this.cellCache[y];
			for (let x = from.x; x < from.x + size.x && x < this.grid_size.x; x++) {
				row[x] = val;
			}
		}
	}

	private findFreePosition(size: Vector2): (Vector2 | undefined) {
		for (let y = 0; y < this.grid_size.y - size.y + 1; y++) {
			for (let x = 0; x < this.grid_size.x - size.x + 1; x++) {
				const pos = new Vector2(x, y);
				if (!this.hasWidget(pos, size)) {
					return pos;
				}
			}
		}
		return undefined;
	}

	add(widget: WidgetRaw<any>) {
		if (!widget.position ||
				this.hasWidget(widget.position, widget.size)) {
			if (widget.position) {
				console.log(`Collision detected for ${widget.type} ${widget.id}, repositioning`);
			}
			widget.position = this.findFreePosition(widget.size);
		}

		if (widget.position) {
			this.setHasWidget(widget.position, widget.size, true);
		} else {
			console.error(`Unable to find a position for ${widget.type} ${widget.id}`);
		}
	}

	resolveAll(widgets: WidgetRaw<any>[]) {
		widgets.filter(widget => widget.position).forEach(this.add.bind(this));
		widgets.filter(widget => !widget.position).forEach(this.add.bind(this));
	}
}
