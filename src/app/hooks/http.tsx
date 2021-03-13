import { checkHostPermission } from "app/components/RequestHostPermission";
import { usePromise } from "./promises";

const proxy_url = config.PROXY_URL;

function makeProxy(url: string) {
	if (typeof browser !== 'undefined') {
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


async function fetchJSON(url: string) {
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


async function fetchXML(url: string) {
	const response = await fetchCheckCors(new Request(url, {
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


/**
* Downloads a JSON document from a URL.
*
* @param {string} url - The URL
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[response, error]]} - Response and error
*/
export function useJSON<T>(url: string, dependents?: any[]): [(T | null), (string | null)] {
	return usePromise(() => fetchJSON(makeProxy(url)), dependents);
}


/**
* Downloads a JSON document from a URL.
*
* @param {string} path - Path to endpoint, relative to API_URL's path.
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

	return usePromise(() => fetchJSON(url.toString()), dependents);
}


/**
* Downloads an XML document from a URL.
*
* @param {string} url - The URL
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[response, error]]} - Response and error
*/
export function useXML(url: string, dependents?: any[]): [(Document | null), (string | null)] {
	return usePromise(() => fetchXML(makeProxy(url)), dependents);
}
