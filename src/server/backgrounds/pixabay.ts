import fetch, { Request } from "node-fetch";
import { BackgroundInfo } from ".";
import { serverConfig, UA_DEFAULT } from "../server";

const PIXABAY_API_KEY =
	process.env.PIXABAY_API_KEY ?? serverConfig.PIXABAY_API_KEY;

interface PixabayImage {
	pageURL: string;
	largeImageURL: string;
	user: string
}

export default async function getImageFromPixabay(): Promise<BackgroundInfo> {
	const url = new URL("https://pixabay.com/api/");
	url.searchParams.set("key", PIXABAY_API_KEY);
	url.searchParams.set("orientation", "horizontal");
	url.searchParams.set("editors_choice", "true");
	url.searchParams.set("safesearch", "true");
	url.searchParams.set("image_type", "photo");
	url.searchParams.set("category", "nature");
	url.searchParams.set("min_width", "1920");
	url.searchParams.set("min_height", "1080");
	url.searchParams.set("per_page", "5");

	const response = await fetch(new Request(url, {
		method: "GET",
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		}
	}));

	const json : { hits: PixabayImage[] } = JSON.parse(await response.text());
	const image : PixabayImage = json.hits[Math.floor(Math.random() * json.hits.length)];
	return {
		url: image.largeImageURL,
		author: image.user,
		site: "Pixabay",
		link: image.pageURL,
	}
}
