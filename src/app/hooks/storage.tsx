import { cacheStorage, IStorage, largeStorage, storage } from "app/storage";
import debounce from "app/utils/debounce";
import { useCallback, useMemo, useState } from "react";
import { useForceUpdate } from ".";
import { useRunPromise } from "./promises";


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
* Allows retrieving and updating a value in large storage
*
* @param {string} key - the key
* @param {T} defaultValue - default value if storage not set
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[value, setValue]]} - Response and error
*/
export function useLargeStorage<T>(key: string,
		defaultValue?: (T | null)): [T | null, (val: T) => void] {
	return useStorageBacking(largeStorage, key, defaultValue);
}



/**
* Allows retrieving and updating a value in cache storage
*
* @param {string} key - the key
* @param {T} defaultValue - default value if storage not set
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[value, setValue]]} - Response and error
*/
export function useCache<T>(key: string,
		defaultValue?: (T | null), enableDebounce?: boolean): [T | null, (val: T) => void] {
	return useStorageBacking(cacheStorage, key, defaultValue, enableDebounce);
}
