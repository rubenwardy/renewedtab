import { Vector2 } from "./Vector2";

export default function deepCopy(value: any) {  
	if (typeof value !== "object" || value === null) {
		return value;
	}

	if (value instanceof Date) {
		return new Date(value);
	} else if (value instanceof Vector2) {
		return new Vector2(value.x, value.y);
	}

	const retval: any = Array.isArray(value) ? [] : {};
	Object.setPrototypeOf(retval, Object.getPrototypeOf(value));

	for (const key in value) {
		retval[key] = deepCopy(value[key]);
	}

	return retval;
}
