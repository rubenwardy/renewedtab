import { cacheStorage } from "./Storage";


interface CachedIcon {
	url: string;
	fetchedAt: Date;
}


function getDomain(url: string): string {
	return new URL(url).hostname;
}


async function fetchIconURL(url: string): Promise<string> {
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
	return ret.toString();
}


function blobToDataURL(blob: Blob): Promise<string> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (e: any) => {
			resolve(e.target.result);
		}
		reader.readAsDataURL(blob);
	})
}


async function fetchIcon(url: string): Promise<string> {
	const key = "icon-" + new URL(url).hostname;
	if (cacheStorage) {
		const value = await cacheStorage.get<CachedIcon>(key);
		if (value) {
			console.log(`Loaded favicon for ${key} from cache`);
			await cacheStorage.set(key, value);
			return value.url;
		}
	}

	const iconUrl = await fetchIconURL(url);
	const response = await fetch(new Request(iconUrl, {
		method: "GET",
		headers: {
			"Accept": "image/*",
		},
	}));

	const blob = await response.blob();
	const data = await blobToDataURL(blob);
	await cacheStorage.set(key, {
		url: data,
		fetchedAt: new Date(),
	});

	return data;
}


const cache = new Map<string, Promise<string>>();

function getWebsiteIcon(url: string): Promise<string> {
	const key = getDomain(url);
	if (!cache.has(key)) {
		cache.set(key, fetchIcon(url));
	}

	return cache.get(key)!;
}


export async function getWebsiteIconOrNull(url: string): Promise<(string | undefined)> {
	try {
		return await getWebsiteIcon(url);
	} catch (e) {
		console.error(e);
		return undefined;
	}
}


export function clearWebsiteIcons() {
	cache.clear();
}
