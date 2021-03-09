import fetch, { Request } from "node-fetch";
import { IS_DEBUG, UA_PROXY } from "./server";

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


export async function handleProxy(url: URL): Promise<Result> {
	const key = url.toString();
	if (cache.has(key)) {
		return cache.get(key)!;
	}

	const response = await fetch(new Request(url, {
		method: "GET",
		size: 1 * 1000 * 1000,
		headers: {
			"User-Agent": UA_PROXY,
			"Accept": "application/json, application/xml, text/xml, application/rss+xml, application/atom+xml",
		}
	}));

	if (!response.ok) {
		return {
			status: response.status,
			text: response.statusText,
			contentType: "text/plain",
		};;
	}

	const retval = {
		status: response.status,
		text: await response.text(),
		contentType: response.headers.get("Content-Type") ?? "text/plain",
	};


	cache.set(key, retval);
	return retval;
}
