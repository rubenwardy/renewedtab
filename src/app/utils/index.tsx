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
