import { fromTypedJSON, toTypedJSON } from "TypedJSON";
import { Widget } from "Widget";
import { WidgetTypes } from "widgets";

const sections = [
	{
		title: "Minetest",
		links: [
			{
				"title": "ContentDB Audit Log",
				"url": "https://content.minetest.net/admin/audit/"
			},
			{
				"title": "GitHub",
				"url": "https://github.com/notifications"
			},
			{
				"title": "CTF Monitor",
				"url": "https://monitor.rubenwardy.com/d/9TgIegyGk/ctf"
			},
		]
	},
	{
		title: "Interesting reads",
		links: [
			{
				"title": "UX StackExchange",
				"url": "https://ux.stackexchange.com"
			},
			{
				"title": "UX Collective",
				"url": "https://uxdesign.cc/"
			}
		]
	}
];

interface WidgetRaw<T> {
	id: number;
	type: string;
	props: T;
}

export interface WidgetProps<T> extends WidgetRaw<T> {
	child: (props: T) => JSX.Element;
	save(): void;
}

export class WidgetManager {
	private widget_props: (WidgetRaw<any>)[] = [];

	get widgets(): (JSX.Element)[] {
		return this.widget_props.map(widget => Widget({
			id: widget.id,
			type: widget.type,
			props: widget.props,
			child: WidgetTypes[widget.type],
			save: this.save.bind(this),
		}));
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
		this.widget_props = [
			{
				id: 1,
				type: "Links",
				props: {
					sections: sections
				}
			},
			{
				id: 2,
				type: "Notes",
				props: {
					localStorageKey: "notes"
				}
			},
			{
				id: 3,
				type: "Age",
				props: {
					birthDate: new Date("1971-01-01")
				}
			},
			{
				id: 4,
				type: "Weather",
				props: {
					locationId: "51d45n2d59",
					locationName:"Bristol"
				}
			}
		];
	}
}
