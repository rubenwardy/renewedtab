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
export async function firstPromise<T>(funcs: (() => Promise<T>)[]): Promise<(T | undefined)> {
	for (let i = 0; i < funcs.length; i++) {
		try {
			const value = await funcs[i]();
			if (value != undefined) {
				return value;
			}
		} catch {
			continue;
		}
	}

	return undefined;
}
