import { TippyTopImage } from "common/api/icons";
import { fetchBinaryAsDataURL, fetchCheckCors, getAPI } from "./hooks/http";
import { cacheStorage } from "./storage";
import { firstPromise } from "./utils";


interface CachedIcon {
	url: string;
	fetchedAt: Date;
}


function getDomain(url: string): string {
	return new URL(url).hostname;
}


let tippytops: Promise<TippyTopImage[]> | undefined = undefined;


const ICON_SELECTORS = ([
	`link[rel="apple-touch-icon"]`,
	`link[rel="apple-touch-icon-precomposed"]`,
	`link[rel="icon shortcut"]`,
	`link[rel="shortcut icon"]`,
	`link[rel="icon"]`,
	`meta[name="apple-touch-icon"]`,
]).join(", ");


function validateIcon(res: Response) {
	const mime = res.headers.get("Content-Type");
	if (mime && !mime.startsWith("image/")) {
		throw new Error("Invalid icon");
	}
}


async function fetchTippyTops(url: string): Promise<string | undefined> {
	if (!tippytops) {
		tippytops = getAPI("/website-icons/", {});
	}

	const data = await tippytops;
	if (data) {
		const domain = getDomain(url);
		const icon = data.find(x => x.domains.includes(domain) ||
			x.domains.includes(`www.${domain}`) ||
			x.domains.includes(domain.replace("www.", "")));
		if (icon) {
			return await fetchBinaryAsDataURL(icon.image_url, validateIcon);
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
	let topIcon: (string | null) = null;
	for (const icon of icons.values()) {
		const href = icon.tagName.toLowerCase() == "meta"
			? icon.getAttribute("content")
			: icon.getAttribute("href");
		if (!href || href.startsWith("data:")) {
			continue;
		}

		const sizes = icon.getAttribute("sizes")
			?.split(" ")?.map(
				size => size.split("x").map(x => parseInt(x))) ?? [];

		const sizeScores = sizes.map(size => Math.min(...size));

		const score =
			(icon.getAttribute("rel")?.includes("apple-touch-icon-precomposed") ? 10 : 0) +
			(icon.getAttribute("rel")?.includes("apple-touch-icon") ? 10 : 0) +
			(href.toLowerCase().endsWith(".ico") ? 0 : 10) +
			Math.max(0, ...sizeScores);

		if (score >= topScore) {
			topScore = score;
			topIcon = href;
		}
	}

	if (!topIcon) {
		return undefined;
	}

	const ret = new URL(topIcon, response.url);
	return await fetchBinaryAsDataURL(ret.toString(), validateIcon);
}


const SUBDOMAIN_REMOVAL = new Set([
	"feeds", "rss", "feedrss", "feedsrss", "rssfeeds", "atom"]);


function getParentDomainIfWhitelisted(urlStr: string): string | undefined {
	const url = new URL(urlStr);
	const first = url.host.split(".")[0];
	if (SUBDOMAIN_REMOVAL.has(first)) {
		url.host = url.host.substring(first.length + 1);
		url.pathname = "/";
		return url.toString();
	}

	return undefined;
}


async function fetchIcon(url: string): Promise<string | undefined> {
	const key = "favicon-" + new URL(url).hostname;
	const value = await cacheStorage.get<CachedIcon>(key);
	if (value) {
		console.log(`Loaded favicon for ${key} from cache`);
		return value.url;
	}

	const rootURL = new URL(url);
	rootURL.pathname = "/";

	const parentURL = getParentDomainIfWhitelisted(url)

	const data = await firstPromise([
		() => fetchTippyTops(url),
		() => fetchIconURL(url),
		url != rootURL.toString() && (() => fetchIconURL(rootURL.toString())),
		parentURL ? (() => fetchTippyTops(parentURL)) : undefined,
		parentURL ? (() => fetchIconURL(parentURL)) : undefined,
		() => fetchBinaryAsDataURL(new URL("/favicon.ico", url).toString(), validateIcon),
	]);
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
	try {
		const key = getDomain(url);
		if (!cache.has(key)) {
			cache.set(key, fetchIcon(url));
		}

		return cache.get(key)!;
	} catch (e) {
		return Promise.reject(e);
	}
}


export async function getWebsiteIconOrNull(url: (string | undefined)): Promise<(string | undefined)> {
	if (url == "" || url == undefined) {
		return undefined;
	}

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
