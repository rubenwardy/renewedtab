import { IS_DEBUG } from "server";

export function makeKeyCache<T, U>(func: (arg: T) => U, timeout = 3): (arg: T) => U {
	const cache = new Map<T, U>();
	if (!IS_DEBUG) {
		setInterval(() => {
			cache.clear();
		}, timeout * 60 * 1000);
	}

	return (arg: T) => {
		const key = arg;
		if (cache.has(key)) {
			return cache.get(key)!;
		}

		const ret = func(arg);
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
