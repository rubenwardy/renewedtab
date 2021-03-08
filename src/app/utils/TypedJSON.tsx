import { Vector2 } from "./Vector2";

type JSONValues = { [key: string]: any } | any[] | string | number | boolean | null;

export function toTypedJSON(anyObj: JSONValues): JSONValues {
	if (anyObj == null) {
		return null;
	} else if (Array.isArray(anyObj)) {
		return (anyObj as any[]).map(x => toTypedJSON(x));
	} else if (anyObj instanceof Date) {
		return {
			__type__: "date",
			value:  (anyObj as Date).toISOString()
		};
	} else if (anyObj instanceof Vector2) {
		const vec = anyObj as Vector2;
		return {
			__type__: "vec2",
			x: vec.x,
			y: vec.y,
		};
	} else if (typeof(anyObj) == "object") {
		const obj = anyObj as { [key: string]: any };
		const out: { [key: string]: any } = {};

		for (let key in obj) {
			out[key] = toTypedJSON(obj[key]);
		}

		return out;
	} else {
		return anyObj;
	}
}

export function fromTypedJSON(anyObj: JSONValues): any {
	if (Array.isArray(anyObj)) {
		return (anyObj as any[]).map(x => fromTypedJSON(x));
	} else if (typeof(anyObj) == "object") {
		if (anyObj == null) {
			return null;
		}

		const obj = anyObj as { [key: string]: any };
		if (anyObj.__type__) {
			if (anyObj.__type__ == "date") {
				return new Date(Date.parse(anyObj.value));
			} else if (anyObj.__type__ == "vec2") {
				return new Vector2(anyObj.x, anyObj.y);
			} else {
				console.error("Unknown type: ", anyObj.__type__);
			}
		} else {
			const out: { [key: string]: any } = {};
			for (let key in obj) {
				out[key] = fromTypedJSON(obj[key]);
			}
			return out;
		}
	} else {
		return anyObj;
	}
}
