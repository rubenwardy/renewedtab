import { config } from "app";
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


function makeProxy(url: string){
	const ret = new URL(proxy_url);
	ret.searchParams.set("url", url);
	return ret.toString();
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
			const response = await fetch(new Request(makeProxy(url), {
				method: "GET",
				headers: {
					"Accept": "application/json",
				}
			}));

			return await response.json();
		}

		fetchJSON(url)
			.then(setInfo)
			.catch((ex) => setError("Failed to load weather"));
	}, dependents);

	return [info, error];
}
