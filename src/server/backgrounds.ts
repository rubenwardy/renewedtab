import fetch, { Request } from "node-fetch";
import { PIXABAY_API_KEY } from "./server";

interface PixabayImage {
	pageURL: string;
	largeImageURL: string;
	user: string
}


let cache : PixabayImage | null = null;
async function getImageFromPixabay() {
	if (cache) {
		return cache;
	}

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
			"Accept": "application/json",
		}
	}));

	const json : { hits: PixabayImage[] } = JSON.parse(await response.text());
	cache = json.hits[Math.floor(Math.random() * json.hits.length)];
	return cache;
}


export async function getBackground() {
	const image = await getImageFromPixabay();
	return {
		image_url: image.largeImageURL,
		author: {
			title: image.user,
			url: null
		},
		site: {
			title: "Pixabay",
			url: "https://pixabay.com",
		},
		url: image.pageURL,
	};
}
