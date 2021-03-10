import { storage } from "app/Storage";
import { useState } from "react";
import { runPromise } from "./promises";

/**
* Allows retrieving and updating a value in storage
*
* @param {string} key - the key
* @param {T} defaultValue - default value if storage not set
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[value, setValue]]} - Response and error
*/
export function useStorage<T>(key: string, defaultValue?: (T | null), dependents?: any[]): [T | null, (val: T) => void] {
	const [value, setValue] = useState<T | null>(null);

	runPromise<T | null>(() => storage.get(key),
		(v) => setValue(v ?? defaultValue ?? null),
		() => {}, dependents);

	function updateValue(val: T) {
		storage.set(key, val);
		setValue(val);
	}

	return [value, updateValue];
}
