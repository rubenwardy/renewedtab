import uuid from "app/utils/uuid";
import { FeedSource } from ".";
import { relativeURLToAbsolute } from "../../app/utils";
import { parseDate } from "../../app/utils/dates";


export interface Feed {
	title?: string;
	link?: string;
	articles: Article[];
	source?: FeedSource;
}

export interface Article {
	id: string;
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

export type XMLParser = (source: string, lang: string) => Document;

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


function getChildrenWithTagName(root: Element, tagname: string) {
	return Array.from(root.getElementsByTagName(tagname)).filter(x => x.parentElement == root);
}


function parseRSSFeed(root: Element, baseURL: string, parseXML: XMLParser): Feed {
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

		const link = relativeURLToAbsolute(el.querySelector("link")?.textContent?.trim(), baseURL);
		const id = el.querySelector("guid")?.textContent?.trim() ?? link ?? uuid();
		feed.articles.push({
			id,
			title: escapeHTMLtoText(title, parseXML).trim(),
			link,
			image: relativeURLToAbsolute(img?.[0], baseURL),
			alt: img?.[1],
			date: parseDate(el.querySelector("pubDate")?.textContent?.trim() ?? undefined),
			feed: feed
		});
	});

	return feed;
}


function parseAtomFeed(root: Element, baseURL: string, parseXML: XMLParser): Feed | null {
	const rootLinks = getChildrenWithTagName(root, "link");
	const linkEle = rootLinks.find(x => x.getAttribute("type")?.includes("html")) ??
		rootLinks.find(x => x.getAttribute("rel") == "alternate");
	const feed: Feed = {
		title: getChildrenWithTagName(root, "title")[0]?.textContent ?? undefined,
		link: relativeURLToAbsolute(linkEle?.getAttribute("href"), baseURL),
		articles: [],
	};

	root.querySelectorAll("entry").forEach(el => {
		const img = getImage(el, parseXML);
		const title = el.querySelector("title")?.textContent;
		if (!title) {
			return;
		}

		const link = el.querySelector("link:not([rel='enclosure'])")?.getAttribute("href")?.trim();
		const id = el.querySelector("id")?.textContent?.trim() ?? link ?? uuid();
		feed.articles.push({
			id,
			title: escapeHTMLtoText(title, parseXML).trim(),
			link: relativeURLToAbsolute(link, baseURL),
			image: relativeURLToAbsolute(img?.[0], baseURL),
			alt: img?.[1],
			date: parseDate(el.querySelector("updated")?.textContent?.trim() ?? undefined),
			feed: feed,
		});
	});

	return feed;
}


interface JSONFeedItem {
	id?: string;
	url?: string;
	title?: string;
	summary?: string;
	image?: string;
	date_published?: string;
	tags?: string[];

	// One of the following is required
	content_html?: string;
	content_text?: string;
}


interface JSONFeed {
	title: string;
	home_page_url?: string;
	description?: string;
	items: JSONFeedItem[];
}


function parseJSONFeed(json: JSONFeed, baseURL: string, parseXML: XMLParser): Feed {
	const feed: Feed = {
		title: json.title,
		link: relativeURLToAbsolute(json.home_page_url, baseURL),
		articles: [],
	};

	feed.articles = json.items.map(item => {
		const link = relativeURLToAbsolute(item.url, baseURL);
		const id = item.id ?? link ?? uuid();
		return {
			id,
			title: item.title ?? item.content_text ?? escapeHTMLtoText(item.content_html!, parseXML),
			link,
			image: relativeURLToAbsolute(item.image, baseURL),
			date: parseDate(item.date_published),
			feed: feed,
		};
	});

	return feed;
}


export function parseFeed(body: string, baseURL: string, parseXML: XMLParser): Feed | null {
	let json: any;
	try {
		json = JSON.parse(body);
	} catch (e) {
		if (!(e instanceof SyntaxError)) {
			throw e;
		}
		json = undefined;
	}

	if (json) {
		return parseJSONFeed(json, baseURL, parseXML);
	}

	const document = parseXML(body, "application/xml");
	const root = document.children[0];
	if (root.tagName == "rss" || root.tagName.toLowerCase().includes("rdf")) {
		return parseRSSFeed(root, baseURL, parseXML);
	} else if (root.tagName == "feed") {
		return parseAtomFeed(root, baseURL, parseXML);
	} else {
		return null;
	}
}
