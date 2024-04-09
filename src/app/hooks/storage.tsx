import { IStorage, storage } from "app/storage";
import debounce from "app/utils/debounce";
import { useCallback, useMemo, useState } from "react";
import { useForceUpdate } from ".";
import { useRunPromise } from "./promises";
import { getImage, Image, storeImage } from "app/storage/database";


function useStorageBacking<T>(backing: IStorage, key: string,
		defaultValue?: (T | null), enableDebounce?: boolean): [T | null, (val: T) => void] {
	// For table values
	const forceUpdate = useForceUpdate();

	const [value, setValue] = useState<T | null>(null);

	useRunPromise<T | null>(() => backing.get(key),
		(v) => setValue(v ?? defaultValue ?? null),
		() => {}, [ key ]);

	const setStorage = useMemo(
		() => debounce((val: T) => backing.set(key, val), 1000),
		[key, backing]);

	const updateValue = useCallback((val: T) => {
		if (enableDebounce) {
			setStorage(val);
		} else {
			backing.set(key, val)
		}
		setValue(val);
		forceUpdate();
	}, [backing, enableDebounce, forceUpdate, key, setStorage]);

	return [value, updateValue];
}


/**
* Allows retrieving and updating a value in storage
*
* @param {string} key - the key
* @param {T} defaultValue - default value if storage not set
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[value, setValue]]} - Response and error
*/
export function useStorage<T>(key: string,
		defaultValue?: (T | null), enableDebounce?: boolean): [T | null, (val: T) => void] {
	return useStorageBacking(storage, key, defaultValue, enableDebounce);
}



/**
* Allows retrieving and updating an image
*
* @param {string} key - the key
* @param {string?} defaultValue - default value if storage not set
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[value, setValue]]} - Response and error
*/
export function useImage(key: string): [Image | null, (data: string, filename: string) => void] {
	const [value, setValue] = useState<Image | null>(null);

	useRunPromise<Image | null>(() => getImage(key),
		(v) => setValue(v ?? null),
		() => {}, [ key ]);

	const update = useCallback((data: string, filename: string) => {
		// TODO: debounce?
		const image: Image = {
			id: key,
			data: data,
			filename,
		};
		storeImage(image).catch(console.error);
		setValue(image);
	}, [key, setValue]);

	return [value, update];
}
