import fetchCatch, { Request } from "../http";
import { BackgroundInfo } from ".";
import { serverConfig, UA_DEFAULT } from "../server";

const UNSPLASH_ACCESS_KEY =
	process.env.UNSPLASH_ACCESS_KEY ?? serverConfig.UNSPLASH_ACCESS_KEY;

interface UnsplashImage {
	color: string;
	location?: { title: string };
	links: { html: string };
	user: { name: string, links: { html: string } };
	urls: { raw: string };
}

export default async function getImageFromUnsplash(): Promise<BackgroundInfo> {
	const url = new URL("https://api.unsplash.com/photos/random");
	url.searchParams.set("collections", "42576559");

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
		throw Error("Unsplash rate limit exceeded");
	}

	const image : UnsplashImage = JSON.parse(text);
	return {
		title: image.location?.title,
		color: image.color,
		url: image.urls.raw + "&w=2048&h=1117&crop=entropy&fit=crop",
		author: image.user.name,
		site: "Unsplash",
		link: image.links.html + "?utm_source=homescreen&utm_medium=referral",
	};
}
