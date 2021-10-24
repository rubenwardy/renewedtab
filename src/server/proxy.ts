import fetchCatch, { Request } from "./http";
import { serverConfig, UA_PROXY } from ".";
import { makeKeyCache } from "./cache";
import UserError from "./UserError";

const PROXY_ALLOWED_HOSTS: string[] = serverConfig.PROXY_ALLOWED_HOSTS ?? [
	"feeds.bbci.co.uk",
	"fdo.rocketlaunch.live",
	"theregister.com",
	"www.nasa.gov",
];

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
			`Consider using the Chrome/Firefox extension instead.`);
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
