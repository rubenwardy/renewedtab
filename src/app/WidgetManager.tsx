import { fromTypedJSON, toTypedJSON } from "./utils/TypedJSON";
import { Widget } from "./components/Widget";
import { WidgetTypes } from "./widgets";
import React from "react";


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
}

export class WidgetManager {
	private widget_props: (WidgetRaw<any>)[] = [];

	get widgets(): (JSX.Element)[] {
		return this.widget_props.map(raw => {
			const props = {
				key: raw.id,
				id: raw.id,
				type: raw.type,
				props: raw.props,
				child: WidgetTypes[raw.type],
				save: this.save.bind(this),
			};

			return (<Widget {...props} />);
		});
	}

	constructor() {
		const json = localStorage.getItem("widgets");
		if (json) {
			this.widget_props = fromTypedJSON(JSON.parse(json));
		} else {
			this.resetToDefault();
		}
	}

	save() {
		console.log("Saving");
		localStorage.setItem("widgets", JSON.stringify(toTypedJSON(this.widget_props)));
	}

	resetToDefault() {
		this.widget_props = [];
		["Links", "Notes", "Age", "Weather"].forEach(this.createWidget.bind(this));
	}

	createWidget(type: string) {
		const widget = WidgetTypes[type];

		this.widget_props.push({
			id: this.widget_props.length + 1,
			type: type,
			props: Object.assign({}, widget.defaultProps)
		});
		this.save();
	}
}
