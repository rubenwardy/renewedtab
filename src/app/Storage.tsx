import { fromTypedJSON, toTypedJSON } from "./utils/TypedJSON";


/**
 * Interface to support storing and retrieving information
 */
export interface IStorage {
	getAll(): Promise<{ [key: string]: any }>;
	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, value: T): Promise<void>;
	remove(key: string): Promise<void>;
	clear(): Promise<void>;
}


class WebExtStorage implements IStorage {
	private readonly store : any;

	constructor() {
		this.store = browser.storage.local;
	}

	async getAll(): Promise<{ [key: string]: any }> {
		console.log(`[Storage] Get All`);
		return fromTypedJSON(await this.store.get());
	}

	async get<T>(key: string): Promise<T | null> {
		if (key == undefined) {
			return null;
		}

		console.log(`[Storage] Get ${key}`);
		const ret = fromTypedJSON(await this.store.get(key));
		return ret ? ret[key] : null;
	}

	async set<T>(key: string, value: T): Promise<void> {
		console.log(`[Storage] Set ${key}`);
		await this.store.set({
			[key]: toTypedJSON(value)
		});
	}

	async remove(key: string): Promise<void> {
		await this.store.remove(key);
	}

	async clear(): Promise<void> {
		await this.store.clear();
	}
}


class LocalStorage implements IStorage {
	async getAll(): Promise<{ [key: string]: any }> {
		console.log(`[Storage] Get All`);
		const ret: { [key: string]: any } = {};
		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (key && !key.startsWith("_")) {
				ret[key] = await this.get(key);
			}
		}

		return ret;
	}

	async get<T>(key: string): Promise<T | null> {
		if (key == undefined) {
			return null;
		}

		console.log(`[Storage] Get ${key}`);
		const json = window.localStorage.getItem(key);
		return json ? fromTypedJSON(JSON.parse(json)) : null;
	}

	async set<T>(key: string, value: T): Promise<void> {
		console.log(`[Storage] Set ${key}`);
		window.localStorage.setItem(key, JSON.stringify(toTypedJSON(value)));
	}

	async remove(key: string): Promise<void> {
		window.localStorage.removeItem(key);
	}

	async clear(): Promise<void> {
		window.localStorage.clear();
	}
}


class DelegateStorage implements IStorage {
	constructor(private delegate: IStorage, private prefix: string) {}

	async getAll(): Promise<{ [key: string]: any; }> {
		const data = await this.delegate.getAll();
		return Object.entries(data)
			.filter(([key, _value]) => key.startsWith(this.prefix));
	}

	async get<T>(key: string): Promise<T | null> {
		if (key == undefined) {
			return null;
		}
		return await this.delegate.get(this.prefix + key);
	}

	async set<T>(key: string, value: T): Promise<void> {
		await this.delegate.set(this.prefix + key, value);
	}

	async remove(key: string): Promise<void> {
		await this.delegate.remove(this.prefix + key);
	}

	async clear(): Promise<void> {
		await this.delegate.clear();
	}
}


if (typeof browser === 'undefined' &&
		navigator.storage && navigator.storage.persist) {
	navigator.storage.persist()
		.then((isPersisted) =>
			console.log(`Persisted storage granted: ${isPersisted}`))
		.catch(console.error);
}


export const storage : IStorage =
	(typeof browser !== 'undefined') ? new WebExtStorage() : new LocalStorage();

export const largeStorage : IStorage = new DelegateStorage(storage, "large-");

export const cacheStorage : IStorage = new DelegateStorage(new LocalStorage(), "_");
