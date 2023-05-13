import { BackgroundInfo } from "common/api/backgrounds";
import getImageFromUnsplash from "./unsplash";
import { IS_DEBUG } from "server/config";

let cache : BackgroundInfo[] | null = null;

async function fillCache(): Promise<BackgroundInfo[]> {
	const images: BackgroundInfo[] = [];
	for (let i = 0; i < 4; i++) {
		images.push(await getImageFromUnsplash("42576559"));
	}

	cache = images;
	return cache;
}


if (!IS_DEBUG) {
	setInterval(() => {
		fillCache().catch(console.error);
	}, 15 * 60 * 1000);
}


export async function getBackground(): Promise<BackgroundInfo[]> {
	if (cache) {
		return cache;
	}

	try {
		return await fillCache();
	} catch (e) {
		console.error(e);
		return [{
			id: "unsplash:comjArgHF4Y",
			title: "Valdez, United States",
			color: "#404059",
			url: "https://images.unsplash.com/photo-1533756972958-d6f38a9761e3?ixid=MnwyMTM1ODB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTU0ODI1MjQ&ixlib=rb-1.2.1&w=1920&h=1080",
			author: "Chad Peltola",
			site: "Unsplash",
			links: {
				photo: "https://unsplash.com/photos/comjArgHF4Y?utm_source=renewedtab&utm_medium=referral",
				author: "https://unsplash.com/@chadpeltola?utm_source=renewedtab&utm_medium=referral",
				site: "https://unsplash.com?utm_source=renewedtab&utm_medium=referral",
			},
		}];
	}
}

getBackground().catch(console.error);
