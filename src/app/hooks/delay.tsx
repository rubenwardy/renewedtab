import { useCallback, useEffect, useState } from "react";


/**
 * Cancellable delayed callback
 *
 * @param callback Lambda to call when on timeout
 * @param ms Timeout period, in milliseconds
 * @return {[start, cancel]]} - Start and cancel
 */
export function useDelay(callback: (...args: any[]) => void,
		ms?: number, ...args: any[]): [(() => void), (() => void)] {

	const [handle, setHandle] = useState<NodeJS.Timeout | null>(null);

	const start = useCallback(() => {
		if (handle) {
			clearTimeout(handle);
		}

		setHandle(setTimeout(() => {
			callback(...args);
			setHandle(null);
		}, ms));
	}, [args, callback, handle, ms]);

	const cancel = useCallback(() => {
		if (handle) {
			clearTimeout(handle);
		}
	}, [handle]);

	useEffect(() => {
		return cancel;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [start, cancel];
}
