import { IS_DEBUG } from "../server";
import getImageFromUnsplash from "./unsplash";

export interface BackgroundInfo {
	title?: string;
	color?: string;
	url: string;
	author: string;
	site: string;
	links: {
		photo: string;
		author: string;
		site: string;
	};
}

let cache : BackgroundInfo | null = null;
if (!IS_DEBUG) {
	setInterval(() => {
		cache = null;
		getBackground().catch(console.error);
	}, 15 * 60 * 1000);
}

export async function getBackground(): Promise<BackgroundInfo> {
	if (cache) {
		return cache;
	}

	try {
		cache = await getImageFromUnsplash("42576559");
		return cache;
	} catch (e) {
		console.log(e);
		return {
			title: "Valdez, United States",
			color: "#404059",
			url: "https://images.unsplash.com/photo-1533756972958-d6f38a9761e3?ixid=MnwyMTM1ODB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTU0ODI1MjQ&ixlib=rb-1.2.1&w=1920&h=1080",
			author: "Chad Peltola",
			site: "Unsplash",
			links: {
				photo: "https://unsplash.com/photos/comjArgHF4Y?utm_source=homescreen&utm_medium=referral",
				author: "https://unsplash.com/@chadpeltola?utm_source=homescreen&utm_medium=referral",
				site: "https://unsplash.com?utm_source=homescreen&utm_medium=referral",
			},
		}
	}
}

getBackground().catch(console.error);
