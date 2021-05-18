export default function debounce(func: any, ms: number) { // eslint-disable-line
	let handle: any;
	return (...args: any[]) => {
		if (handle) {
			clearTimeout(handle);
		}
		handle = setTimeout(func, ms, ...args);
	}
}
