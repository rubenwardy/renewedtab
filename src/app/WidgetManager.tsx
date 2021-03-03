import { fromTypedJSON, toTypedJSON } from "./utils/TypedJSON";
import { Widget } from "./components/Widget";
import { WidgetTypes } from "./widgets";
import React, { useState } from "react";


type ReactFactory<T> = ((props: T) => JSX.Element) ;
export interface WidgetFactory<T> extends ReactFactory<T> {
	defaultProps: T;
}

interface WidgetRaw<T> {
	id: number;
	type: string;
	props: T;
}

export interface WidgetProps<T> extends WidgetRaw<T> {
	child: WidgetFactory<T>;
	save(): void;
	remove(): void;
}

export class WidgetManager {
	private id_counter = 0;
	private widget_props: (WidgetRaw<any>)[] = [];
	private change_handler: (() => void) | null = null;

	get widgets(): (JSX.Element)[] {
		return this.widget_props.map(raw => {
			const props = {
				key: raw.id,
				id: raw.id,
				type: raw.type,
				props: raw.props,
				child: WidgetTypes[raw.type],
				save: this.save.bind(this),
				remove: () => this.removeWidget(raw.id),
			};

			return (<Widget {...props} />);
		});
	}

	constructor() {
		const json = localStorage.getItem("widgets");
		if (json) {
			this.widget_props = fromTypedJSON(JSON.parse(json));
			this.id_counter =
				this.widget_props.reduce((max, widget) => Math.max(widget.id, max), 0);
		} else {
			this.resetToDefault();
		}
	}

	onChange(handler: () => void) {
		this.change_handler = handler;
	}

	save() {
		console.log("Saving");
		localStorage.setItem("widgets", JSON.stringify(toTypedJSON(this.widget_props)));
	}

	resetToDefault() {
		this.widget_props = [];
		["Links", "Notes", "Age", "Weather", "RSS"].forEach(this.createWidget.bind(this));
	}

	createWidget(type: string) {
		this.id_counter++;

		const widget = WidgetTypes[type];

		this.widget_props.push({
			id: this.id_counter,
			type: type,
			props: Object.assign({}, widget.defaultProps)
		});
		this.save();
	}

	removeWidget(id: number) {
		console.log("Remove widget by id ", id);
		var i = this.widget_props.length;
		while (i--) {
			if (this.widget_props[i].id == id) {
				console.log("- found and deleted ", this.widget_props[i]);
				this.widget_props.splice(i, 1);
			}
		}
		this.save();

		if (this.change_handler) {
			this.change_handler();
		}
	}
}


const _wm = new WidgetManager();
export function useWidgetManager() {
	const [_, updateState] = useState<any>(null);
	_wm.onChange(() => updateState({}));
	return _wm;
}
