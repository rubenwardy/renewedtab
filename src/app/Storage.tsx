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
	private readonly values: Promise<{ [key: string]: any }>;

	constructor(private readonly store: browser.storage.StorageArea) {
		this.values = this.loadData();
	}

	private async loadData() {
		return fromTypedJSON(await this.store.get()) ?? {};
	}

	async getAll(): Promise<{ [key: string]: any }> {
		console.log(`[Storage] Get All`);
		return await this.values;
	}

	async get<T>(key: string): Promise<T | null> {
		if (key == undefined) {
			return null;
		}

		console.log(`[Storage] Get ${key}`);
		const values = await this.values;
		return values ? values[key] : null;
	}

	async set<T>(key: string, value: T): Promise<void> {
		console.log(`[Storage] Set ${key}`);

		const jsonValue = toTypedJSON(value);
		const values = await this.values;
		values[key] = jsonValue;
		await this.store.set({
			[key]: jsonValue
		});
	}

	async remove(key: string): Promise<void> {
		const values = await this.values;
		delete values[key];
		await this.store.remove(key);
	}

	async clear(): Promise<void> {
		const values = await this.values;
		Object.keys(values).forEach(key => delete values[key]);
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

		const json = JSON.stringify(toTypedJSON(value));
		try {
			window.localStorage.setItem(key, json);
		} catch (e: any) {
			if (typeof e.toString() != "function" ||
					!e.toString().includes("Quota") ||
					typeof browser != "undefined") {
				throw e;
			}

			clearLocalStorage();
			window.localStorage.setItem(key, json);
		}
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
		throw new Error("Unimplemented");
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


if (typeof browser === 'undefined' && typeof navigator !== "undefined" &&
		navigator.storage && navigator.storage.persist) {
	navigator.storage.persist()
		.then((isPersisted) =>
			console.log(`Persisted storage granted: ${isPersisted}`))
		.catch(console.error);
}


export const storage : IStorage =
	(typeof browser !== 'undefined') ? new WebExtStorage(browser.storage.local) : new LocalStorage();

export const largeStorage : IStorage = new DelegateStorage(storage, "large-");

export const cacheStorage : IStorage = new DelegateStorage(new LocalStorage(), "_");

export function clearLocalStorage() {
	const opt_out = window.localStorage.getItem("_sentry-opt-out");
	window.localStorage.clear();
	if (opt_out) {
		window.localStorage.setItem("_sentry-opt-out", opt_out);
	}
}
