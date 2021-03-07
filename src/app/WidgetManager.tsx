import { Schema } from "./utils/schema";
import { fromTypedJSON, toTypedJSON } from "./utils/TypedJSON";
import { Vector2 } from "./utils/Vector2";
import { WidgetTypes } from "./widgets";


type ReactFactory<T> = ((props: T) => JSX.Element) ;
export interface WidgetFactory<T> extends ReactFactory<T> {
	defaultProps: T;
	defaultSize: Vector2;
	schema: Schema;
}

export interface WidgetRaw<T> {
	id: number;
	type: string;
	props: T;

	position?: Vector2;
	size: Vector2;
}

export interface WidgetProps<T> extends WidgetRaw<T> {
	child: WidgetFactory<T>;
	save(): void;
	remove(): void;
}

export class WidgetManager {
	private id_counter = 0;

	widgets: (WidgetRaw<any>)[] = [];

	constructor() {
		const json = localStorage.getItem("widgets");
		if (json) {
			this.widgets = fromTypedJSON(JSON.parse(json))
				.filter((widget: WidgetRaw<any>) => WidgetTypes[widget.type]);
			this.id_counter =
				this.widgets.reduce((max, widget) => Math.max(widget.id, max), 0);

			this.widgets.forEach(widget => {
				widget.position = undefined;
				widget.size = widget.size || WidgetTypes[widget.type].defaultSize;
			})
		} else {
			this.resetToDefault();
		}
	}

	save() {
		console.log("Saving");
		localStorage.setItem("widgets", JSON.stringify(toTypedJSON(this.widgets)));
	}

	resetToDefault() {
		this.widgets = [];
		["Clock", "Search", "Age", "Links", "Notes", "Weather",
				"RSS", "SpaceFlights", "HelpAbout"].forEach(this.createWidget.bind(this));
	}

	createWidget(type: string) {
		this.id_counter++;

		const widget = WidgetTypes[type];

		this.widgets.push({
			id: this.id_counter,
			type: type,
			position: undefined,
			size: widget.defaultSize,
			props: Object.assign({}, widget.defaultProps)
		});
		this.save();
	}

	removeWidget(id: number) {
		console.log("Remove widget by id ", id);
		var i = this.widgets.length;
		while (i--) {
			if (this.widgets[i].id == id) {
				console.log("- found and deleted ", this.widgets[i]);
				this.widgets.splice(i, 1);
			}
		}
		this.save();
	}
}
