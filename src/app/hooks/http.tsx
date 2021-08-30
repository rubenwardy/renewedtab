import { checkHostPermission } from "app/components/RequestHostPermission";
import { miscMessages } from "app/locale/common";
import { bindValuesToDescriptor } from "app/locale/MyMessageDescriptor";
import UserError from "app/utils/UserError";
import { defineMessages } from "react-intl";
import { usePromise } from "./promises";


const messages = defineMessages({
	httpRequestFailed: {
		defaultMessage: "HTTP request failed, {code} {msg}.",
	},
})


function makeProxy(url: string) {
	if (typeof browser !== 'undefined') {
		console.log("Detected running as webext");
		return url;
	} else {
		const ret = new URL(config.PROXY_URL);
		ret.searchParams.set("url", url);
		return ret.toString();
	}
}


async function fetchCheckCors(request: Request, init?: RequestInit): Promise<Response> {
	try {
		return await fetch(request, init);
	} catch (e) {
		if (typeof(e) == "object" && typeof (e as Error).message == "string" &&
				((e as Error).message.includes("NetworkError") ||
					(e as Error).message.includes("Failed to fetch"))) {
			await checkHostPermission(request.url);
			throw new UserError(miscMessages.no_network);
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
		throw new UserError(await response.text());
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
		if (response.headers.get("content-type")?.startsWith("text/html")) {
			throw new UserError(bindValuesToDescriptor(messages.httpRequestFailed, { code: response.status, msg: response.statusText }));
		} else {
			throw new UserError(str);
		}
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
 * Bulds URL to API endpoind
 *
 * @param path API path
 * @param args API args
 */
export function buildAPIURL(path: string, args?: Record<string, any>): URL {
	const url = new URL(config.API_URL);
	url.pathname = (url.pathname + path).replace(/\/\//g, "/");
	Object.entries(args ?? {}).forEach(([key, value]) => {
		if (value instanceof Array) {
			value.forEach(single => {
				url.searchParams.append(key.toString(), (single as any).toString());
			});
		} else {
			url.searchParams.set(key.toString(), (value as any).toString());
		}
	});
	return url;
}


/**
 * Downloads a JSON document from a URL.
 *
 * @param {string} path - Path to endpoint, relative to API_URL's path.
 * @param {any} args - Key-value object representing query arguments.
 * @param {any[]} dependents - A list of dependent variables for the URL.
 * @return {[response, error]]} - Response and error
 */
export async function getAPI<T>(path: string, args: any): Promise<T> { // eslint-disable-line
	return fetchJSON(buildAPIURL(path, args).toString());
}


/**
 * Downloads a JSON document from a URL.
 *
 * @param {string} path - Path to endpoint, relative to API_URL's path.
 * @param {any} args - Key-value object representing query arguments.
 * @param {any[]} dependents - A list of dependent variables for the URL.
 * @return {[response, error]]} - Response and error
 */
export function useAPI<T>(path: string, args: any, // eslint-disable-line
		dependents?: any[]): [(T | null), (string | null)] {
	return usePromise(() => getAPI(path, args), dependents ?? []);
}


/**
 * Downloads an XML document from a URL.
 *
 * @param {string} url - The URL
 * @param {any[]} dependents - A list of dependent variables for the URL.
 * @return {[response, error]]} - Response and error
 */
export function useXML(url: string, dependents?: any[]): [(Document | null), (string | null)] {
	return usePromise(() => fetchXML(makeProxy(url)), dependents ?? []);
}
