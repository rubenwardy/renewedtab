import TLDS from "./tlds.json";


/**
 * Combine multiple strings representing className lists.
 *
 * Falsey values are ignored, allowing for inline logic:
 *
 *     mergeClasses("something", props.isThing && "thing", props.className)
 *
 * @param classes Var args to merge
 * @returns resulting string
 */
export function mergeClasses(...classes: (string | false | null | undefined)[]) {
	return classes.filter(c => c).join(" ");
}

/**
 * Returns `v` unless it is outside the range `min <= x <= max`,
 * in which case the closest of `min` and `max` is returned.
 *
 * @param v The number to clamp
 * @param min Min val
 * @param max Max val
 * @returns
 */
export function clampNumber(v: number, min: number, max: number): number {
	return Math.min(max, Math.max(v, min));
}


/**
 * Returns the result of the first promise that is successful, or undefined
 *
 * @param funcs
 * @returns
 */
export async function firstPromise<T>(funcs: ((() => Promise<T>) | false | undefined)[]): Promise<(T | undefined)> {
	for (let i = 0; i < funcs.length; i++) {
		const func = funcs[i];
		if (func == false || func == undefined) {
			continue;
		}

		try {
			const value = await func();
			if (value != undefined) {
				return value;
			}
		} catch {
			continue;
		}
	}

	return undefined;
}


/**
 * Does query match any values in `args`?
 *
 * @param query
 * @param args
 * @returns
 */
export function queryMatchesAny(query: string, ...args: string[]) {
	return query == "" ||
		args.some(x => x.toLowerCase().includes(query.toLowerCase()));
}


export function parseURL(v: string): URL | undefined {
	try {
		return new URL(v);
	} catch (e) {
		return undefined;
	}
}


export function getProbableURL(v: string): string | null {
	const startsWithHttp = v.startsWith("http://") || v.startsWith("https://");

	const url = parseURL(startsWithHttp ? v : `http://${v}`);
	if (url && (startsWithHttp || v.endsWith("/") ||
			TLDS.some(tld => url.hostname.endsWith(`.${tld}`)))) {
		return url.toString();
	} else {
		return null;
	}
}


export function relativeURLToAbsolute(url: (string | null | undefined | false), base: string): (string | undefined) {
	if (!url) {
		return undefined;
	}

	return new URL(url, base).toString();
}


/**
 * Formats a number to an integer or "-" for undefined, without doing `-0`.
 * @param v the number
 * @returns An integer or `-` for undefined
 */
export function formatInteger(v: (number | undefined)): string {
	if (v == undefined) {
		return "-";
	} else if (v <= 0 && v > -0.5) {
		return "0";
	} else {
		return v.toFixed(0);
	}
}
