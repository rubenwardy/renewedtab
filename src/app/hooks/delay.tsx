import { useEffect, useState } from "react";


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

	function start() {
		if (handle) {
			clearTimeout(handle);
		}

		setHandle(setTimeout(() => {
			callback(...args);
			setHandle(null);
		}, ms));
	}

	function cancel() {
		if (handle) {
			clearTimeout(handle);
		}
	}

	useEffect(() => {
		return cancel;
	}, []);

	return [start, cancel];
}
