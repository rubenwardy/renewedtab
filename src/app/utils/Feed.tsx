import { relativeURLToAbsolute } from ".";
import { parseDate } from "./dates";


export interface FeedSource {
	id: string;
	title: string;
	url: string;
}


export enum FeedType {
	Rss,
	Atom,
}

export interface Feed {
	title?: string;
	link?: string;
	articles: Article[];
	source?: FeedSource;
}


export interface Article {
	feed: Feed;
	title: string;
	link?: string;
	image?: string;
	alt?: string;
	date?: Date;
}

function cleanURL(url: string) {
	if (url.startsWith("//")) {
		return "https://" + url.slice(2);
	} else {
		return url;
	}
}

type XMLParser = (source: string, lang: string) => Document;

function escapeHTMLtoText(html: string, parseXML: XMLParser): string {
	const root = parseXML(`<span>${html}</span>`, "text/html");
	return root.children[0].textContent!;
}


function getImage(el: Element, parseXML: XMLParser): ([string, string | undefined] | undefined) {
	const enclosure = el.querySelector("enclosure[type^='image/'][url]");
	if (enclosure) {
		return [cleanURL(enclosure.getAttribute("url")!), undefined];
	}

	const mediaGroup = Array.from(el.getElementsByTagName("media:content"))
		.filter(x => x.getAttribute("url") &&
			(!x.hasAttribute("medium") || x.getAttribute("medium") == "image"));
	if (mediaGroup.length > 0) {
		return [cleanURL(mediaGroup[0].getAttribute("url")!), undefined];
	}

	const tags = el.querySelector("StoryImage, fullimage");
	if (tags && tags.textContent) {
		return [cleanURL(tags.textContent), undefined];
	}

	const html = el.getElementsByTagName("content:encoded")[0]?.textContent ??
		el.querySelector("description, summary, content")?.textContent ?? undefined;
	if (!html) {
		return undefined;
	}

	const imgs = Array.from(parseXML(html, "text/html").querySelectorAll("img[src]"))
		.filter(x => !x.getAttribute("src")?.startsWith("http://feeds.feedburner.com/~ff/rss/"));
	if (imgs.length == 0) {
		return undefined;
	}

	return [cleanURL(imgs[0].getAttribute("src")!), imgs[0].getAttribute("alt") ?? ""];
}


export function parseFeed(root: Element, baseURL: string, parseXML: XMLParser): Feed | null {
	if (root.tagName == "rss") {
		const feed: Feed = {
			title: root.querySelector("channel > title")?.textContent ?? undefined,
			link: relativeURLToAbsolute(root.querySelector("channel > link")?.textContent, baseURL),
			articles: [],
		};

		root.querySelectorAll("item").forEach(el => {
			const img = getImage(el, parseXML);
			const title = el.querySelector("title")?.textContent;
			if (!title) {
				return;
			}

			feed.articles.push({
				title: escapeHTMLtoText(title, parseXML).trim(),
				link: relativeURLToAbsolute(el.querySelector("link")?.textContent?.trim(), baseURL),
				image: relativeURLToAbsolute(img?.[0], baseURL),
				alt: img?.[1],
				date: parseDate(el.querySelector("pubDate")?.textContent?.trim() ?? undefined),
				feed: feed
			});
		});

		return feed;
	} else if (root.tagName == "feed") {
		const feed: Feed = {
			title: root.getElementsByTagName("title")[0]?.textContent ?? undefined,
			link: relativeURLToAbsolute(root.querySelector("link")?.getAttribute("href"), baseURL),
			articles: [],
		};

		root.querySelectorAll("entry").forEach(el => {
			const img = getImage(el, parseXML);
			const title = el.querySelector("title")?.textContent;
			if (!title) {
				return;
			}

			feed.articles.push({
				title: escapeHTMLtoText(title, parseXML).trim(),
				link: relativeURLToAbsolute(el.querySelector("link")?.getAttribute("href")?.trim(), baseURL),
				image: relativeURLToAbsolute(img?.[0], baseURL),
				alt: img?.[1],
				date: parseDate(el.querySelector("updated")?.textContent?.trim() ?? undefined),
				feed: feed,
			});
		});

		return feed;
	} else {
		return null;
	}
}
