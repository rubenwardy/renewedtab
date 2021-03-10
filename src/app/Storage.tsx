import { fromTypedJSON, toTypedJSON } from "./utils/TypedJSON";


/**
 * Interface to support storing and retrieving information
 */
interface IStorage {
	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, value: T): void;
	remove(key: string): void;
	clear(): Promise<void>;
}


class WebExtStorage implements IStorage {
	private readonly store : any;

	constructor() {
		// TODO: change this to `sync` when we have an app ID
		this.store = browser.storage.local;
	}

	async get<T>(key: string): Promise<T | null> {
		console.log(`[Storage] Get ${key}`);
		const ret = await this.store.get(key)
		return ret ? ret[key] : null;
	}

	set<T>(key: string, value: T): void {
		console.log(`[Storage] Set ${key}`);
		this.store.set({
			[key]: value
		});
	}

	remove(key: string): void {
		this.store.remove(key);
	}

	async clear(): Promise<void> {
		await this.store.clear();
	}
}


class LocalStorage implements IStorage {
	async get<T>(key: string): Promise<T> {
		console.log(`[Storage] Get ${key}`);
		const json = localStorage.getItem(key);
		return json ? fromTypedJSON(JSON.parse(json)) : null;
	}

	set<T>(key: string, value: T): void {
		console.log(`[Storage] Set ${key}`);
		localStorage.setItem(key, JSON.stringify(toTypedJSON(value)));
	}

	remove(key: string): void {
		localStorage.removeItem(key);
	}

	async clear(): Promise<void> {
		localStorage.clear();
	}
}


export const storage : IStorage =
	(typeof browser !== 'undefined') ? new WebExtStorage() : new LocalStorage();
