type JSType = "boolean" | "string" | "number" | "object" | (new (...args: any[]) => any);
export type Type = JSType | "perm_url";


/**
 * Schema is a key-value object used to define the types that are expected.
 *
 * Used to provide automatic forms to edit widgets.
 */
export default interface Schema {
	[name: string]: Type;
}
