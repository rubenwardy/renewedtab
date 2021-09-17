import { fetchBinaryAsDataURL, fetchCheckCors } from "./hooks/http";
import { cacheStorage } from "./Storage";
import { firstPromise } from "./utils";


interface CachedIcon {
	url: string;
	fetchedAt: Date;
}


function getDomain(url: string): string {
	return new URL(url).hostname;
}


interface TippyTopImage {
	domains: string[];
	image_url: string;
}


let tippytops: Promise<TippyTopImage[]> | undefined = undefined;
const TIPPY_TOP_URL = "https://mozilla.github.io/tippy-top-sites/data/icons-top2000.json";


const ICON_SELECTORS = ([
	`link[rel="apple-touch-icon"]`,
	`link[rel="apple-touch-icon-precomposed"]`,
	`link[rel="icon shortcut"]`,
	`link[rel="shortcut icon"]`,
	`link[rel="icon"]`,
	`meta[name="apple-touch-icon"]`,
]).join(", ");


async function fetchTippyTops(url: string): Promise<string | undefined> {
	if (!tippytops) {
		tippytops = (async () => {
			const response = await fetchCheckCors(new Request(TIPPY_TOP_URL), { method: "GET" });
			return await response.json();
		})();
	}

	const data = await tippytops;
	if (data) {
		const domain = getDomain(url);
		const icon = data.find(x => x.domains.includes(domain) ||
			x.domains.includes(`www.${domain}`) ||
			x.domains.includes(domain.replace("www.", "")));
		console.log(domain, icon);
		if (icon) {
			return await fetchBinaryAsDataURL(icon.image_url);
		}
	}

	return undefined;
}


async function fetchIconURL(url: string): Promise<string | undefined> {
	const response = await fetchCheckCors(new Request(url, {
		method: "GET",
		headers: {
			"Accept": "text/html",
		},
	}));

	const html = new window.DOMParser().parseFromString(
		await response.text(), "text/html");

	const icons = html.querySelectorAll(ICON_SELECTORS);

	let topScore = -1;
	let topIcon : (string | null) = null;
	for (const icon of icons.values()) {
		const href = icon.tagName.toLowerCase() == "meta"
				? icon.getAttribute("content")
				: icon.getAttribute("href");
		if (!href || href.startsWith("data:")) {
			continue;
		}

		const sizes = icon.getAttribute("sizes")
				?.split(" ")
				.map(size => size.split("x").map(x => parseInt(x))) ?? [];

		const sizeScores = sizes.map(size => Math.min(...size));

		const score =
			(icon.getAttribute("rel")?.includes("apple-touch-icon") ? 10 : 0) +
			(href.toLowerCase().endsWith(".ico") ? 0 : 10) +
			Math.max(0, ...sizeScores);

		if (score > topScore) {
			topScore = score;
			topIcon = href;
		}
	}

	const ret = new URL(topIcon ?? "/favicon.ico", response.url);
	return await fetchBinaryAsDataURL(ret.toString());
}


async function fetchIcon(url: string): Promise<string | undefined> {
	const key = "icon-" + new URL(url).hostname;
	const value = await cacheStorage.get<CachedIcon>(key);
	if (value) {
		console.log(`Loaded favicon for ${key} from cache`);
		return value.url;
	}

	const data = await firstPromise([
			() => fetchTippyTops(url),
			() => fetchIconURL(url) ]);
	if (data) {
		await cacheStorage.set(key, {
			url: data,
			fetchedAt: new Date(),
		});
		return data;
	}

	return undefined;
}


const cache = new Map<string, Promise<string | undefined>>();

function getWebsiteIcon(url: string): Promise<string | undefined> {
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
