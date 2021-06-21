export function enumToValue(e: any, value: (string | number)) {
	return typeof value == "number" ? value : e[value];
}

export function enumToString(e: any, value: (string | number)) {
	return typeof value == "string" ? value : e[value];
}
