import { cacheStorage } from "./Storage";


interface CachedIcon {
	url: string;
	lastUsed: Date;
}


function getDomain(url: string): string {
	return new URL(url).hostname;
}


async function fetchIcon(url: string): Promise<string> {
	const key = new URL(url).hostname;
	if (cacheStorage) {
		const value = await cacheStorage.get<CachedIcon>(key)
		if (value) {
			console.log(`Loaded favicon for ${key} from cache`);

			value.lastUsed = new Date();
			await cacheStorage.set(key, value);
			return value.url;
		}
	}

	const response = await fetch(new Request(url, {
		method: "GET",
		headers: {
			"Accept": "text/html",
		},
	}));

	const html = new window.DOMParser().parseFromString(
		await response.text(), "text/html");

	const icons = html.querySelectorAll("link[rel~='icon']");

	let topScore = -1;
	let topIcon : (Element | null) = null;
	for (const icon of icons.values()) {
		const sizes = icon.getAttribute("sizes")?.split("x") ?? [];
		const score = sizes.map((x) => parseInt(x))
			.reduce((acc, x) => acc + x, 0);
		if (score > topScore) {
			topScore = score;
			topIcon = icon;
		}
	}

	const ret = new URL(topIcon?.getAttribute("href") ?? "/favicon.ico", url);
	await cacheStorage.set(key, {
		url: ret.toString(),
		lastUsed: new Date(),
	});

	console.log(`Fetched favicon from ${key}`);
	return ret.toString();
}


const cache = new Map<string, Promise<string>>();

export function getWebsiteIcon(url: string): Promise<string> {
	const key = getDomain(url);
	if (!cache.has(key)) {
		cache.set(key, fetchIcon(url));
	}

	return cache.get(key)!;
}

export function clearWebsiteIcons() {
	cache.clear();
}
