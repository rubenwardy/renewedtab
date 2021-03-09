import { config } from "app";
import { checkHostPermission } from "app/components/RequestHostPermission";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const proxy_url = config.PROXY_URL;

/**
 * Runs promise and makes cancellable
 *
 * @param func Lambda to make promise
 * @param then If successful and not cancelled
 * @param reject If unsuccessful and not cancelled
 * @param dependents A list of dependent variables
 */
export function usePromise<T>(func: () => Promise<T>,
		then: (value: T) => void, reject: (reason: any) => void,
		dependents?: any[]) {
	useEffect(() => {
		let cancelled = false;

		func().then((value) => {
			if (!cancelled) {
				then(value);
			}
		}).catch((reason) => {
			if (!cancelled) {
				reject(reason);
			}
		});

		return () => {
			cancelled = true;
		}
	}, dependents);
}


/**
* Automatically scales a HTML TextArea element to the height of its content,
* or the specified max-height, whichever is smaller. Returns a ref to attach to
* the TextArea which should be scaled.
*
* @param {number} maxHeight - An optional maximum height, defaults to Infinity.
* @param {any[]} dependents - A list of dependent variables for the TextArea's content.
* @return {RefObject} - A RefObject to attach to the targeted TextArea.
*/
export function useAutoTextArea(maxHeight?: number, dependents?: any[]): React.RefObject<HTMLTextAreaElement> {
	const ref = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;
		ref.current.style.height = '';
		ref.current.style.height = Math.min(ref.current.scrollHeight + 2, maxHeight ?? Infinity) + 'px';
	}, [ ref.current, ...dependents || [] ]);

	return ref;
}


function makeProxy(url: string) {
	if (window.browser) {
		console.log("Detected running as webext");
		return url;
	} else {
		const ret = new URL(proxy_url);
		ret.searchParams.set("url", url);
		return ret.toString();
	}
}


async function fetchCheckCors(request: Request, init?: RequestInit): Promise<Response> {
	try {
		return await fetch(request, init);
	} catch (e) {
		if (typeof(e) == "object" && e.message.includes("NetworkError")) {
			await checkHostPermission(request.url);
		}
		throw e;
	}
}


/**
* Downloads a JSON document from a URL, without using a proxy
*
* @param {number} url - The URL
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[response, error]]} - Response and error
*/
function useJSONRaw<T>(url: string, dependents?: any[]): [(T | null), (string | null)] {
	const [info, setInfo] = useState<T | null>(null);
	const [error, setError] = useState<any | null>(null);

	const fetchJSON = async (url: string) => {
		const response = await fetchCheckCors(new Request(url, {
			method: "GET",
			headers: {
				"Accept": "application/json",
			}
		}));

		if (!response.ok) {
			throw await response.text();
		}

		return await response.json();
	}

	usePromise(() => fetchJSON(url), setInfo, setError, dependents);

	return [info, error];
}


/**
* Downloads a JSON document from a URL.
*
* @param {number} url - The URL
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[response, error]]} - Response and error
*/
export function useJSON<T>(url: string, dependents?: any[]): [(T | null), (string | null)] {
	return useJSONRaw(makeProxy(url), dependents);
}


/**
* Downloads a JSON document from a URL.
*
* @param {number} path - Path to endpoint, relative to API_URL's path.
* @param {any} args - Key-value object representing query arguments.
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[response, error]]} - Response and error
*/
export function useAPI<T>(path: string, args: any, dependents?: any[]): [(T | null), (string | null)] {
	const url = new URL(config.API_URL);
	url.pathname = (url.pathname + path).replaceAll("//", "/");
	Object.entries(args).forEach(([key, value]) => {
		url.searchParams.set(key.toString(), (value as Object).toString());
	})

	return useJSONRaw(url.toString(), dependents);
}


/**
* Downloads an XML document from a URL.
*
* @param {number} url - The URL
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[response, error]]} - Response and error
*/
export function useXML(url: string, dependents?: any[]): [(Document | null), (string | null)] {
	const [info, setInfo] = useState<Document | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchXML = async (url: string) => {
		const response = await fetchCheckCors(new Request(makeProxy(url), {
			method: "GET",
			headers: {
				"Accept": "application/json",
			}
		}));

		const str = await response.text();
		if (!response.ok) {
			throw str;
		}

		const xml = new window.DOMParser().parseFromString(str, "text/xml");
		return xml;
	}

	usePromise(() => fetchXML(url), setInfo, setError, dependents);

	return [info, error];
}
