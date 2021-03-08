export type Type = string | (new (...args: any[]) => any);


/**
 * Schema is a key-value object used to define the types that are expected.
 *
 * Used to provide automatic forms to edit widgets.
 */
export interface Schema {
	[name: string]: Type;
}
