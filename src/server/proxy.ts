import fetchCatch, { Request } from "./http";
import { autocompleteFeeds, autocompleteWebcomics, autocompleteBackgroundFeeds } from "./data";
import { makeKeyCache } from "./cache";
import UserError from "./UserError";
import { UA_PROXY, serverConfig } from "./config";


const PROXY_ALLOWED_HOSTS_SET = new Set(serverConfig.PROXY_ALLOWED_HOSTS ?? []);
[
	...autocompleteFeeds,
	...autocompleteWebcomics,
	...autocompleteBackgroundFeeds,
].map(x => new URL(x.value).hostname).forEach(x => PROXY_ALLOWED_HOSTS_SET.add(x));
const PROXY_ALLOWED_HOSTS = [...PROXY_ALLOWED_HOSTS_SET];
console.log(PROXY_ALLOWED_HOSTS);

export interface Result {
	status: number;
	text: string;
	contentType: string;
}


function checkProxyURL(url: URL) {
	const hostAllowed = PROXY_ALLOWED_HOSTS.some(other =>
		url.hostname == other || url.hostname.endsWith("." + other));
	if (!hostAllowed) {
		throw new UserError(`Accessing host ${url.hostname} is not allowed on the web version. ` +
			`For security reasons, the web version may only access pre-approved domains. ` +
			`Consider using the Chrome/Firefox/Edge extension instead.`);
	}
}


async function fetchProxy(url: URL): Promise<Result> {
	checkProxyURL(url);

	const response = await fetchCatch(new Request(url, {
		method: "GET",
		size: 1 * 1000 * 1000,
		timeout: 10000,
		headers: {
			"User-Agent": UA_PROXY,
			"Accept": "application/json, application/xml, text/xml, application/rss+xml, application/atom+xml",
		},
	}));

	if (!response.ok) {
		return {
			status: response.status,
			text: response.statusText,
			contentType: "text/plain",
		};
	}

	const retval = {
		status: response.status,
		text: await response.text(),
		contentType: response.headers.get("Content-Type") ?? "text/plain",
	};

	return retval;
}


export const handleProxy: (url: URL) => Promise<Result>
	= makeKeyCache(fetchProxy, 15);
