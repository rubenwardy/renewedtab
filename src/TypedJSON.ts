type JSONValues = { [key: string]: any } | any[] | string | number | boolean | null;

export function toTypedJSON(anyObj: JSONValues): JSONValues {
	if (Array.isArray(anyObj)) {
		return (anyObj as any[]).map(x => toTypedJSON(x));
	} else if (typeof(anyObj) == "object") {
		const obj = anyObj as { [key: string]: any };
		const out: { [key: string]: any } = {};

		for (let key in obj) {
			if (obj[key] instanceof Date) {
				out[key] = {
					__type__: "date",
					value:  (obj[key] as Date).toISOString()
				};
			} else {
				out[key] = toTypedJSON(obj[key]);
			}
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
			return;
		}
		const obj = anyObj as { [key: string]: any };
		if (anyObj.__type__) {
			if (anyObj.__type__ == "date") {
				return new Date(Date.parse(anyObj.value));
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
