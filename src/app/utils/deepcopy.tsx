export default function deepCopy(value: any) {
	if (typeof value !== "object" || value === null) {
		return value;
	}

	let retval: any = Array.isArray(value) ? [] : {};
	for (let key in value) {
		retval[key] = deepCopy(value[key]);
	}

	return retval;
}
