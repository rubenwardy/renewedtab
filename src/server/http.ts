import fetch, { RequestInfo, RequestInit, Request, Response } from "node-fetch";
import UserError from "./UserError";
import { notifyUpstreamRetry } from "./metrics";

export { Request, Response } from "node-fetch";


export default async function fetchCatch(url: RequestInfo, init?: RequestInit): Promise<Response> {
	try {
		init = init ?? {};
		if (!init.timeout) {
			init.timeout = 20000;
		}
		return await fetch(url, init);
	} catch (e) {
		let host = "?";
		if (typeof (url) == "string") {
			host = new URL(url).host;
		} else if (url instanceof Request) {
			const request = url as Request;
			host = new URL(request.url).host;
		}

		throw new UserError(`Error whilst connecting to ${host}`);
	}
}


function isSporadicError(e: unknown): boolean {
	const msg = String(e);
	return msg.includes("error whilst connecting to") ||
		msg.includes("response timeout while trying to fetch") ||
		msg.includes("internal service error") ||
		msg.includes("service unavailable");
}


function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}


export async function fetchRetry(url: RequestInfo, init?: RequestInit): Promise<Response> {
	let tries = 3;
	while (1) {
		tries--;

		try {
			return await fetchCatch(url, init);
		} catch (e) {
			if (!isSporadicError(e) || tries == 0) {
				throw e;
			}

			await sleep(200);

			const urlO = new URL(url.toString());
			notifyUpstreamRetry(urlO.hostname);
		}
	}

	// This is unreachable
	throw null;
}
