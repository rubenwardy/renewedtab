import { config } from "app";
import { checkHostPermission } from "app/components/RequestHostPermission";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const proxy_url = config.PROXY_URL;


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


/**
* Downloads a JSON document from a URL.
*
* @param {number} url - The URL
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[response, error]]} - Response and error
*/
export function useJSON<T>(url: string, dependents?: any[]): [(T | null), (string | null)] {
	const [info, setInfo] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchJSON = async (url: string) => {
			await checkHostPermission(url);

			const response = await fetch(new Request(makeProxy(url), {
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

		fetchJSON(url).then(setInfo).catch(setError);
	}, dependents);

	return [info, error];
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

	useEffect(() => {
		const fetchXML = async (url: string) => {
			await checkHostPermission(url);

			const response = await fetch(new Request(makeProxy(url), {
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

		fetchXML(url).then(setInfo).catch(setError);
	}, dependents);

	return [info, error];
}
