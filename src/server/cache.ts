import { IS_DEBUG } from "server";


type AnyFunc<R> = (...args: any[]) => R;
type GetKeyFunc = (...args: any[]) => string;


/**
 * Wraps a function `func` with in-memory caching
 *
 * @param func Function to be cached
 * @param timeout In minutes
 * @param getKey Function to get caching key from arguments passed to `func`.
 *     Defaults to .toString() of first argument.
 * @returns Function with same signature as `func`, but cached
 */
export function makeKeyCache<R>(func: AnyFunc<R>, timeout: number,
		getKey: GetKeyFunc = (x) => x.toString()): AnyFunc<R> {
	const cache = new Map<string, R>();
	if (!IS_DEBUG) {
		setInterval(() => {
			cache.clear();
		}, timeout * 60 * 1000);
	}

	return (...args: any[]) => {
		const key = getKey(...args);
		console.log(`key is ${key}`);
		if (cache.has(key)) {
			return cache.get(key)!;
		}

		const ret = func(...args);
		cache.set(key, ret);
		if (ret instanceof Promise) {
			ret.catch((e) => {
				console.error(e);
				cache.delete(key);
			});
		}
		return ret;
	}
}
