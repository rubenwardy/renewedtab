import { IS_DEBUG } from "../server";
import getImageFromUnsplash from "./unsplash";

export interface BackgroundInfo {
	url: string;
	author: string;
	site: string;
	link: string;
}

let cache : BackgroundInfo | null = null;
if (!IS_DEBUG) {
	setInterval(() => {
		cache = null;
	}, 15 * 60 * 1000);
}

export async function getBackground(): Promise<BackgroundInfo> {
	if (cache) {
		return cache;
	}

	cache = await getImageFromUnsplash();
	return cache;
}
