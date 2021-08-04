import { BackgroundInfo } from "common/api/backgrounds";
import fetchCatch, { Request } from "../http";
import { serverConfig, UA_DEFAULT } from "..";
import { notifyUpstreamRequest } from "server/metrics";

const UNSPLASH_ACCESS_KEY =
	process.env.UNSPLASH_ACCESS_KEY ?? serverConfig.UNSPLASH_ACCESS_KEY;

interface UnsplashImage {
	id: string;
	color: string;
	location?: { title: string };
	links: { html: string };
	user: { name: string, links: { html: string } };
	urls: { raw: string };
}

export default async function getImageFromUnsplash(collection: string): Promise<BackgroundInfo> {
	if (UNSPLASH_ACCESS_KEY == "") {
		throw new Error("Missing unsplash key")
	}

	const url = new URL("https://api.unsplash.com/photos/random");
	url.searchParams.set("collections", collection);

	notifyUpstreamRequest("Unsplash.com");

	const response = await fetchCatch(new Request(url, {
		method: "GET",
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
			"Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}`
		}
	}));

	const text = await response.text();
	if (text.startsWith("Rate Limit")) {
		throw new Error("Unsplash rate limit exceeded");
	}

	const image : UnsplashImage = JSON.parse(text);
	return {
		id: `unsplash:${image.id}`,
		title: image.location?.title,
		color: image.color,
		url: image.urls.raw + "&w=2048&h=1117&crop=entropy&fit=crop",
		author: image.user.name,
		site: "Unsplash",
		links: {
			photo: image.links.html + "?utm_source=renewedtab&utm_medium=referral",
			author: image.user.links.html + "?utm_source=renewedtab&utm_medium=referral",
			site: "https://unsplash.com?utm_source=renewedtab&utm_medium=referral",
		},
	};
}
