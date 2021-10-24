import fetch, { RequestInfo, RequestInit, Request, Response } from "node-fetch";
import UserError from "./UserError";
export { Request, Response } from "node-fetch";

export default async function fetchCatch(url: RequestInfo, init?: RequestInit): Promise<Response> {
	try {
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
