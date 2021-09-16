import { checkHostPermission } from "app/components/RequestHostPermission";
import { miscMessages } from "app/locale/common";
import { bindValuesToDescriptor } from "app/locale/MyMessageDescriptor";
import { readBlobAsDataURL } from "app/utils/blob";
import { Feed, parseFeed } from "app/utils/Feed";
import UserError from "app/utils/UserError";
import { defineMessages } from "react-intl";
import { usePromise } from "./promises";


const messages = defineMessages({
	httpRequestFailed: {
		defaultMessage: "HTTP request failed, {code} {msg}.",
	},

	missingFeedURL: {
		defaultMessage: "Missing feed URL.",
	},

	errorLoadingFeed: {
		defaultMessage: "Error loading feed. Make sure it is an RSS or Atom feed.",
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
				url.searchParams.append(key.toString(), single.toString());
			});
		} else {
			url.searchParams.set(key.toString(), value.toString());
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


/**
 * Downloads binary file as Data URL
 *
 * @param url URL to fetch
 */
export async function fetchBinaryAsDataURL(url: string): Promise<string> {
	const response = await fetchCheckCors(new Request(url, {
		method: "GET",
	}));

	if (!response.ok) {
		throw new UserError(await response.text());
	}

	const blob = await response.blob();
	return await readBlobAsDataURL(blob);
}


export async function fetchFeed(url: string): Promise<Feed> {
	if (!url) {
		throw new UserError(messages.missingFeedURL);
	}

	const data = await fetchXML(makeProxy(url));

	const feed = parseFeed(data.children[0],
		(s, l) => new window.DOMParser().parseFromString(s, l as any));
	if (!feed) {
		throw new UserError(messages.errorLoadingFeed);
	}

	return feed;
}

export function useFeed(url: string, dependents?: any[]): [Feed | null, any] {
	return usePromise(() => fetchFeed(url), dependents ?? []);
}
