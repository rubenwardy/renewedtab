
export type Type = string | (new (...args: any[]) => any);

export interface Schema {
	[name: string]: Type;
}
