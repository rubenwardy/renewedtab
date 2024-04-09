import { ActualBackgroundProps } from "app/backgrounds/common";
import { storage } from ".";

export interface Image {
	id: string;
	filename: string;
	data: string;
	expiresAt?: Date;
}

function toPromise(request: IDBRequest): Promise<Event> {
	return new Promise((resolve, reject) => {
		request.onsuccess = resolve;
		request.onerror = reject;
	});
}

function transactionToPromise(transaction: IDBTransaction): Promise<Event> {
	return new Promise((resolve, reject) => {
		transaction.oncomplete = resolve;
		transaction.onerror = (event) => {
			console.error("[IndexDB] Transaction error, ", event);
			transaction.abort();
			reject(event);
		};
	});
}


function init(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("renewedtab", 1);
		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			console.log("[IndexDB] Upgrading");
			const db: IDBDatabase = (event.target as any).result;
			db.createObjectStore("Image", { keyPath: "id" });
			db.createObjectStore("BackgroundCache", { keyPath: "id" });
		}

		request.onsuccess = (event) => {
			resolve((event.target as any).result as IDBDatabase);
		};

		request.onerror = (event) => {
			reject(event);
		};
	});
}


async function migrateToIndexedDB() {
	const expectedGlobalKeys = new Set([
		"name", "showBookmarksBar", "theme", "liked_backgrounds",
		"review_request", "background_votes", "background",
		"widgets", "locked", "grid_settings", "locale", "goal",
		"_sentry-opt-out"
	]);

	if (typeof browser !== "undefined") {
		const data = await storage.getAll();
		await Promise.all(Object.entries(data)
			.filter(([key, value]) => key.startsWith("large-") && value)
			.map(async ([key, value]) => {
				await storeImage({
					id: key.slice(6),
					data: value.data,
					filename: value.filename,
				});
				await storage.remove(key);
			}));
	}

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (!key || expectedGlobalKeys.has(key) || key == "_sentry-opt-out") {
			// Ignore
		} else if (key[0] == "_") {
			// Remove, no need to save
			localStorage.removeItem(key);
		} else if (key.startsWith("large-image-")) {
			// Migrate uploads
			const value = localStorage.getItem(key)!;
			const json = JSON.parse(value);
			if (value) {
				await storeImage({
					id: key,
					data: json.data,
					filename: json.filename,
				});
			}
			localStorage.removeItem(key);
		} else {
			console.error(`[Migraye] Unknown localStorage usage: ${key}`);
		}
	}
}


const database = (async () => {
	const db = await init();
	await migrateToIndexedDB();
	return db;
})();


export async function getImage(id: string): Promise<(Image | null)> {
	const db = await database;
	const transation = db.transaction("Image", "readonly");
	const objectStore = transation.objectStore("Image");
	const event = await toPromise(objectStore.get(id));
	const image = (event.target as (any | undefined))?.result ?? null;
	if (new Date() > image?.expiresAt) {
		await removeImage(id);
		return null;
	}
	return image;
}


export async function storeImage(image: Image): Promise<void> {
	const db = await database;
	const transation = db.transaction("Image", "readwrite");
	const objectStore = transation.objectStore("Image");
	await toPromise(objectStore.add(image));
	await transactionToPromise(transation);
}


export async function removeImage(id: string): Promise<void> {
	const db = await database;
	const transation = db.transaction("Image", "readwrite");
	const objectStore = transation.objectStore("Image");
	await toPromise(objectStore.delete(id));
	await transactionToPromise(transation);
}



export interface BackgroundCache extends ActualBackgroundProps {
	key: string;
	fetchedAt: Date;
}


export async function getBackgroundCache(key: string): Promise<BackgroundCache | undefined> {
	const db = await database;
	const transation = db.transaction("BackgroundCache", "readonly");
	const objectStore = transation.objectStore("BackgroundCache");
	const event = await toPromise(objectStore.get(1));
	const cache = (event.target as (any | undefined))?.result ?? null;
	if (!cache || cache.key != key) {
		return undefined;
	}
	return cache;
}


export async function storeBackgroundCache(cache: BackgroundCache) {
	const db = await database;
	const transation = db.transaction("BackgroundCache", "readwrite");
	const objectStore = transation.objectStore("BackgroundCache");
	await toPromise(objectStore.add({ id: 1, ...cache }));
	await transactionToPromise(transation);
}


export async function clearBackgroundCache() {
	const db = await database;
	const transation = db.transaction("BackgroundCache", "readwrite");
	const objectStore = transation.objectStore("BackgroundCache");
	await toPromise(objectStore.clear());
	await transactionToPromise(transation);
}
