import Schema from "./utils/Schema";
import { fromTypedJSON, toTypedJSON } from "./utils/TypedJSON";


export enum BackgroundMode {
	Auto,
	Color,
	ImageUrl,
	// ImageUpload,
	// Reddit
}

export declare type BackgroundModeType = keyof typeof BackgroundMode;

function getSchemaForMode(mode: BackgroundMode): Schema {
	switch (mode) {
	case BackgroundMode.Auto:
		return {};
	case BackgroundMode.Color:
		return {
			color: "string"
		};
	case BackgroundMode.ImageUrl:
		return {
			url: "string",
			position: "string",
		};
	}
}

function getDefaultsForMode(mode: BackgroundMode): { [key: string]: any } {
	switch (mode) {
	case BackgroundMode.Auto:
		return {};
	case BackgroundMode.Color:
		return {
			color: "#336699"
		};
	case BackgroundMode.ImageUrl:
		return {
			url: "",
			position: "center",
		};
	}
}

export function getDescriptionForMode(mode: BackgroundMode): string {
	switch (mode) {
	case BackgroundMode.Auto:
		return "Random backgrounds";
	case BackgroundMode.Color:
		return "A single color";
	case BackgroundMode.ImageUrl:
		return "An image from a URL";
	}
}


/**
 * Stores Background information, and applies it to document.body.
 */
export default class Background {
	getMode(): BackgroundMode {
		const type = (localStorage.getItem("bg_mode")) as BackgroundModeType;
		return BackgroundMode[type] ?? BackgroundMode.Auto
	}

	getSchema(): Schema {
		return getSchemaForMode(this.getMode());
	}

	getValues(): ({ [key: string]: any }) {
		const ret: ({ [key: string]: any }) = {};

		Object.keys(this.getSchema()).forEach(key => {
			ret[key] = this.getValue(key);
		});

		return ret;
	}

	getValue(key: string): (any | undefined) {
		const str = localStorage.getItem("bg_" + key);
		return str ? fromTypedJSON(JSON.parse(str)) : getDefaultsForMode(this.getMode())[key];
	}

	setValue(key: string, v: any) {
		const str = toTypedJSON(v);
		localStorage.setItem("bg_" + key, JSON.stringify(str));
	}

	update() {
		const body = document.body;

		switch (this.getMode()) {
		case BackgroundMode.Auto:
			body.style.backgroundColor = "";
			body.style.backgroundPosition = "";
			body.style.backgroundImage = "url('https://i.redd.it/5hm3u7rb4fk61.jpg')";
			break;
		case BackgroundMode.Color:
			body.style.backgroundColor = this.getValue("color") ?? "black";
			body.style.backgroundImage = "";
			break;
		case BackgroundMode.ImageUrl:
			body.style.backgroundColor = "";
			body.style.backgroundPosition = this.getValue("position");
			body.style.backgroundImage = `url('${this.getValue("url") ?? ""}')`;
			break;
		}
	}
}
