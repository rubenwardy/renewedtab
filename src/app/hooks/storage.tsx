import { IStorage, largeStorage, storage } from "app/Storage";
import debounce from "app/utils/debounce";
import { useMemo, useState } from "react";
import { runPromise } from "./promises";


function useStorageBacking<T>(backing: IStorage, key: string,
		defaultValue?: (T | null)): [T | null, (val: T) => void] {
	const [value, setValue] = useState<T | null>(null);

	runPromise<T | null>(() => backing.get(key),
		(v) => setValue(v ?? defaultValue ?? null),
		() => {}, [ key ]);

	const setStorage = useMemo(
		() => debounce((key: string, val: T) => backing.set(key, val), 1000),
		[ key ]);

	function updateValue(val: T) {
		setStorage(key, val);
		setValue(val);
	}

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
		defaultValue?: (T | null)): [T | null, (val: T) => void] {
	return useStorageBacking(storage, key, defaultValue);
}


/**
* Allows retrieving and updating a value in storage
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
