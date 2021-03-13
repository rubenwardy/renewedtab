import { fromTypedJSON, toTypedJSON } from "./utils/TypedJSON";


/**
 * Interface to support storing and retrieving information
 */
interface IStorage {
	getAll(): Promise<{ [key: string]: any }>;
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

	async getAll(): Promise<{ [key: string]: any }> {
		console.log(`[Storage] Get All`);
		return await this.store.get();
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
	constructor() {
		this.requestPersistantStorage();
	}

	requestPersistantStorage() {
		if (navigator.storage && navigator.storage.persist) {
			navigator.storage.persist()
				.then((isPersisted) =>
					console.log(`Persisted storage granted: ${isPersisted}`))
				.catch(console.error);
		}
	}

	async getAll(): Promise<{ [key: string]: any }> {
		console.log(`[Storage] Get All`);
		const ret: { [key: string]: any } = {};
		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (key) {
				ret[key] = await this.get(key);
			}
		}

		return ret;
	}

	async get<T>(key: string): Promise<T> {
		console.log(`[Storage] Get ${key}`);
		const json = window.localStorage.getItem(key);
		return json ? fromTypedJSON(JSON.parse(json)) : null;
	}

	set<T>(key: string, value: T): void {
		console.log(`[Storage] Set ${key}`);
		window.localStorage.setItem(key, JSON.stringify(toTypedJSON(value)));
	}

	remove(key: string): void {
		window.localStorage.removeItem(key);
	}

	async clear(): Promise<void> {
		window.localStorage.clear();
	}
}


export const storage : IStorage =
	(typeof browser !== 'undefined') ? new WebExtStorage() : new LocalStorage();
