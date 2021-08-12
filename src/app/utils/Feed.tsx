export interface Article {
	title: string;
	link?: string;
	image?: string;
	alt?: string;
}

export enum FeedType {
	Rss,
	Atom,
}

export interface Feed {
	title?: string;
	link?: string;
	articles: Article[];
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
		return [ cleanURL(enclosure.getAttribute("url")!), undefined ];
	}

	const html = el.querySelector("description, summary")?.textContent ?? undefined
	if (!html) {
		return undefined;
	}

	const img = parseXML(html, "text/html").querySelector("img");
	if (!img) {
		return undefined;
	}

	return [ cleanURL(img.getAttribute("src")!), img.getAttribute("alt") ?? ""];
}

export function parseFeed(root: Element, parseXML: XMLParser): Feed | null {
	const articles: Article[] = [];
	if (root.tagName == "rss") {
		root.querySelectorAll("item").forEach(el => {
			const img = getImage(el, parseXML);
			articles.push({
				title: escapeHTMLtoText(el.querySelector("title")!.textContent!, parseXML).trim(),
				link: el.querySelector("link")?.textContent?.trim() ?? undefined,
				image: img && img[0],
				alt: img && img[1],
			});
		});

		return {
			title: root.querySelector("channel > title")!.textContent ?? undefined,
			link: root.querySelector("channel > link")!.textContent ?? undefined,
			articles: articles,
		};
	} else if (root.tagName == "feed") {
		root.querySelectorAll("entry").forEach(el => {
			const img = getImage(el, parseXML);
			articles.push({
				title: escapeHTMLtoText(el.querySelector("title")!.textContent!, parseXML).trim(),
				link: el.querySelector("link")?.getAttribute("href")?.trim(),
				image: img && img[0],
				alt: img && img[1],
			});
		});

		return {
			title: root.getElementsByTagName("title")[0]?.textContent ?? undefined,
			link: root.querySelector("link")?.getAttribute("href") ?? undefined,
			articles: articles
		};
	} else {
		return null;
	}
}
