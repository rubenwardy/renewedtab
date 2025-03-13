import { checkHostPermission } from "app/components/RequestHostPermission";
import { miscMessages } from "app/locale/common";
import { bindValuesToDescriptor } from "app/locale/MyMessageDescriptor";
import { clampNumber } from "app/utils";
import { readBlobAsDataURL } from "app/utils/blob";
import { ONE_DAY_MS, setEndOfDay } from "app/utils/dates";
import { Feed, parseFeed } from "common/feeds/parse";
import UserError from "app/utils/UserError";
import { defineMessages } from "react-intl";
import type { CalendarEvent } from "../utils/calendar";
import { usePromise } from "./promises";
import { FeedSource } from "common/feeds";


const messages = defineMessages({
	httpRequestFailed: {
		defaultMessage: "HTTP request failed, {code} {msg}.",
	},

	missingFeedURL: {
		defaultMessage: "Missing feed URL.",
	},

	errorLoadingFeed: {
		defaultMessage: "Error loading feed. Make sure it is an RSS, JSONFeed, or Atom feed.",
	},

	missingCalendarURL: {
		defaultMessage: "Missing calendar URL. Edit this widget to add it"
	}
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


export async function fetchCheckCors(request: Request, init?: RequestInit): Promise<Response> {
	try {
		return await fetch(request, init);
	} catch (e) {
		if (typeof (e) == "object" && typeof (e as Error).message == "string" &&
			((e as Error).message.includes("NetworkError") ||
				(e as Error).message.includes("Failed to fetch"))) {
			await checkHostPermission(request.url);
			throw new UserError(miscMessages.no_network);
		}
		throw e;
	}
}


async function fetchText(url: string) {
	const response = await fetchCheckCors(new Request(url, {
		method: "GET",
	}));

	if (!response.ok) {
		console.error(response);
		throw new UserError(response.statusText ?? `Error ${response.status}`);
	}

	return await response.text();
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

	if (!(response.headers.get("Content-Type") ?? "").includes("application/json")) {
		throw new Error("Expected JSON, received: "
			+ response.headers.get("Content-Type") + await response.text());
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
* Downloads plain text document from a URL.
*
* @param {string} url - The URL
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[response, error]]} - Response and error
*/
export function useText(url: string, dependents?: any[]): [(string | null), (string | null)] {
	return usePromise(() => fetchText(makeProxy(url)), dependents ?? []);
}


/**
* Downloads a JSON document from a URL.
*
* @param {string} url - The URL
* @param {any[]} dependents - A list of dependent variables for the URL.
* @return {[response, error]]} - Response and error
*/
export function useJSON<T>(url: string, dependents?: any[]): [(T | null), (string | null)] {
	return usePromise(() => fetchJSON(makeProxy(url)), dependents ?? []);
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
export async function fetchAPI<T>(path: string, args: any): Promise<T> {
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
export function useAPI<T>(path: string, args: any,
	dependents?: any[]): [(T | null), (string | null)] {
	return usePromise(() => fetchAPI(path, args), dependents ?? []);
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
export async function fetchBinaryAsDataURL(url: string, validate?: (r: Response) => void): Promise<string> {
	const response = await fetchCheckCors(new Request(url, {
		method: "GET",
	}));

	if (!response.ok) {
		throw new UserError(await response.text());
	}

	validate?.(response);

	const blob = await response.blob();
	return await readBlobAsDataURL(blob);
}


export async function fetchFeed(url: string): Promise<Feed> {
	if (!url) {
		throw new UserError(messages.missingFeedURL);
	}

	const response = await fetchCheckCors(new Request(makeProxy(url), {
		method: "GET",
		headers: {
			"Accept": [
				"application/json", "application/feed+json",
				"application/xml", "text/xml",
				"application/rss+xml", "application/atom+xml"].join(", "),
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

	const feed = parseFeed(str, url,
		(s, l) => new window.DOMParser().parseFromString(s, l as any));
	if (!feed) {
		throw new UserError(messages.errorLoadingFeed);
	}

	return feed;
}


function isFullfilled<T>(promise: PromiseSettledResult<T>): promise is PromiseFulfilledResult<T> {
	return promise.status == "fulfilled";
}


function isRejected<T>(promise: PromiseSettledResult<T>): promise is PromiseRejectedResult {
	return promise.status == "rejected";
}


type FeedErrors = { source: FeedSource, error: UserError }[];

export async function fetchMultiFeed(sources: FeedSource[]): Promise<[Feed, FeedErrors]> {
	if (sources.length == 0 || sources.some(x => !x.url)) {
		throw new UserError(messages.missingFeedURL);
	}

	const allPromises = await Promise.allSettled(sources.map(x => fetchFeed(x.url)));

	const pairedPromises =
		allPromises.map((promise, i) => ({ source: sources[i], promise: promise }));

	const allFeeds =
		pairedPromises
			.filter(({ promise }) => isFullfilled(promise))
			.map(({ source, promise }) => {
				const feed = (promise as PromiseFulfilledResult<Feed>).value;
				feed.source = source;
				return feed;
			});

	if (allFeeds.length == 0) {
		throw (allPromises[0] as PromiseRejectedResult).reason;
	}

	const errors = pairedPromises
		.filter(({ promise }) => isRejected(promise))
		.map(({ source, promise }) => ({ source: source, error: (promise as PromiseRejectedResult).reason }));
	errors.forEach(({ error }) => {
		console.log(error.messageDescriptor);
		if (!(error instanceof UserError)) {
			throw error;
		}
	})

	const MAX_ARTICLES = 100;
	return [{
		articles:
			allFeeds
				.flatMap(x => x.articles)
				.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
				.slice(0, MAX_ARTICLES),
	}, errors];
}

export function useFeed(url: string, dependents?: any[]): [Feed | null, any] {
	return usePromise(() => fetchFeed(url), dependents ?? []);
}

export function useMultiFeed(sources: FeedSource[], dependents?: any[]): [[Feed, FeedErrors] | null, any] {
	return usePromise(() => fetchMultiFeed(sources), dependents ?? []);
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchCalendar(calendar: any, url: string, limitToDays: number): Promise<CalendarEvent[]> {
	limitToDays = clampNumber(Math.floor(limitToDays), 1, 28);

	const start = new Date();
	const end = new Date(start.valueOf() + (limitToDays - 1)*ONE_DAY_MS);
	setEndOfDay(end);

	const text = await fetchText(url);

	return calendar.getEventsBetweenDates(text, start, end)
}



type CalendarErrors = { url: string, error: UserError }[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchMultiCalendar(urls: string[], limitToDays: number): Promise<[CalendarEvent[], CalendarErrors]> {
	if (urls.length == 0 || urls.some(x => x == "")) {
		throw new UserError(messages.missingCalendarURL);
	}

	// const calendar = await import(/* webpackChunkName: "calendar" */ "../utils/calendar");
	// const promises = await Promise.allSettled(
	// 	urls.map(x => fetchCalendar(calendar, x, limitToDays)));

	// const events: CalendarEvent[] =
	// 	promises
	// 		.filter(promise => isFullfilled(promise))
	// 		.flatMap(promise => {
	// 			const events = (promise as PromiseFulfilledResult<CalendarEvent[]>).value;
	// 			return events;
	// 		})
	// 		.sort((a, b) => a.start.valueOf() - b.start.valueOf());

	// const errors: { url: string, error: any }[] = promises
	// 	.map((promise, i) => ({ url: urls[i], promise: promise }))
	// 	.filter(({ promise}) => isRejected(promise))
	// 	.map(({url, promise})  => ({
	// 		url, error: (promise as PromiseRejectedResult).reason
	// 	}));

	// errors.forEach(({ error }) => {
	// 	if (!(error instanceof UserError)) {
	// 		throw error;
	// 	}
	// });

	// return [events, errors];
	return Promise.reject();
}


export function useMultiCalendar(sources: string[], limitToDays: number,
		dependents?: any[]): [[CalendarEvent[], CalendarErrors] | null, any] {
	return usePromise(() => fetchMultiCalendar(sources, limitToDays), dependents ?? []);
}
