import { IStorage } from "./Storage";
import { Vector2 } from "./utils/Vector2";
import { WidgetTypes } from "./widgets";
import { getInitialTheme, Widget } from "./Widget";
import deepCopy from "./utils/deepcopy";


/**
 * Model to store and save widgets.
 */
export class WidgetManager {
	private id_counter = 0;

	widgets: (Widget<unknown>)[] = [];

	constructor(private storage: IStorage) {}

	async load() {
		const json = await this.storage.get<Widget<unknown>[]>("widgets");
		if (!json) {
			this.widgets = [];
			return;
		}

		this.widgets = json.filter((widget: Widget<unknown>) => WidgetTypes[widget.type]);
		this.id_counter =
			this.widgets.reduce((max, widget) => Math.max(widget.id, max), 0);

		for (const widget of this.widgets) {
			widget.position = widget.position ? new Vector2(widget.position.x, widget.position.y) : undefined;
			widget.size = widget.size ?? WidgetTypes[widget.type].defaultSize;

			const widgetType = WidgetTypes[widget.type];

			if (widget.theme == undefined) {
				widget.theme = deepCopy(getInitialTheme(widgetType));
			}

			if (widgetType.onLoaded) {
				await widgetType.onLoaded(widget);
			}
		}
	}

	save() {
		this.storage.set("widgets", this.widgets);
	}

	createWidget<T>(type: string): Widget<T> {
		this.id_counter++;

		const widget_type = WidgetTypes[type];
		const widget: Widget<T> = {
			id: this.id_counter,
			type: type,
			position: undefined,
			size: widget_type.defaultSize,
			props: deepCopy(widget_type.initialProps),
			theme: deepCopy(getInitialTheme(widget_type)),
		};
		this.widgets.push(widget);

		if (widget_type.onCreated) {
			widget_type.onCreated(widget);
		}

		this.save();

		return widget;
	}

	removeWidget(id: number) {
		let i = this.widgets.length;
		while (i--) {
			if (this.widgets[i].id == id) {
				this.widgets.splice(i, 1);
			}
		}
		this.save();
	}

	createFromArray(widgets: any[]): Widget<unknown>[] {
		return widgets.map(widgetData => {
			const widget = this.createWidget(widgetData.type);
			widget.position = widgetData.position ?? undefined;
			widget.size = widgetData.size ?? widget.size;
			widget.props = widgetData.props
				? { ...widgetData.props } : widget.props;
			widget.theme = widgetData.theme
				? { ...widgetData.theme } : widget.theme;
			return widget;
		});
	}
}
