import fetchCatch, { Request } from "../http";
import { BackgroundInfo } from ".";
import { serverConfig, UA_DEFAULT } from "../server";

const UNSPLASH_ACCESS_KEY =
	process.env.UNSPLASH_ACCESS_KEY ?? serverConfig.UNSPLASH_ACCESS_KEY;

interface UnsplashImage {
	color: string;
	description: string;
	links: { html: string };
	user: { name: string, links: { html: string } };
	urls: { raw: string };
}

export default async function getImageFromUnsplash(): Promise<BackgroundInfo> {
	const url = new URL("https://api.unsplash.com/topics/wallpapers/photos");
	url.searchParams.set("orientation", "landscape");
	url.searchParams.set("content_filter", "high");
	url.searchParams.set("order_by", "popular");
	url.searchParams.set("page", (Math.random() * 10 + 1).toFixed(0));

	const response = await fetchCatch(new Request(url, {
		method: "GET",
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
			"Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}`
		}
	}));

	const json : UnsplashImage[] = JSON.parse(await response.text());
	const image = json[Math.floor(Math.random() * json.length)];
	return {
		title: image.description,
		color: image.color,
		url: image.urls.raw + "&w=1920&h=1080",
		author: image.user.name,
		site: "Unsplash",
		link: image.links.html + "?utm_source=homescreen&utm_medium=referral",
	};
}
