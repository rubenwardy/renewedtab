import fetchCatch, { Request } from "./http";
import { IS_DEBUG, UA_PROXY } from "./server";
import dns from "dns";

export interface Result {
	status: number;
	text: string;
	contentType: string;
}


const cache = new Map<string, Result>();
if (!IS_DEBUG) {
	setInterval(() => {
		cache.clear();
	}, 15 * 60 * 1000);
}

function lookupDns(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		dns.lookup(url, (err, address, family) => {
			if (err) {
				reject(err);
			} else {
				resolve(address);
			}
		});
	});
}

function isLocalIP(address: string): boolean {
	return address.startsWith("127.0.0");
}

export async function handleProxy(url: URL): Promise<Result> {
	const key = url.toString();
	if (cache.has(key)) {
		return cache.get(key)!;
	}

	const hostname = url.hostname;
	const address = await lookupDns(url.hostname);
	url.hostname = address;
	if (isLocalIP(address)) {
		throw Error(`Error whilst connecting to ${url.host}`);
	}

	const response = await fetchCatch(new Request(url, {
		method: "GET",
		size: 1 * 1000 * 1000,
		timeout: 10000,
		headers: {
			"Host": hostname,
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

	cache.set(key, retval);
	return retval;
}
