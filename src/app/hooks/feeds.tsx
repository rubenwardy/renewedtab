import { useXML } from "app/hooks/http";
import { escapeHTMLtoText } from "app/utils/html";
import { useIntl } from "react-intl";

export interface Article {
	title: string;
	link: string;
	image?: string;
	alt?: string;
}

export interface Feed {
	title?: string;
	link?: string;
	articles: Article[];
}

function getImage(html?: string): ([string, string] | undefined) {
	if (!html) {
		return undefined;
	}

	const parser = new window.DOMParser().parseFromString(html, "text/html");
	const img = parser.querySelector("img");
	if (!img) {
		return undefined;
	}

	return [ img.getAttribute("src")!, img.getAttribute("alt") ?? ""];
}

function parseFeed(root: Element): Feed | null {
	const articles: Article[] = [];
	if (root.tagName == "rss") {
		root.querySelectorAll("item").forEach(el => {
			const img = getImage(el.querySelector("description")?.textContent ?? undefined);
			articles.push({
				title: escapeHTMLtoText(el.querySelector("title")!.textContent!),
				link: el.querySelector("link")!.textContent!,
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
			const img = getImage(el.querySelector("summary")?.textContent ?? undefined);
			articles.push({
				title: escapeHTMLtoText(el.querySelector("title")!.textContent!),
				link: el.querySelector("link")!.getAttribute("href")!,
				image: img && img[0],
				alt: img && img[1],
			});
		});

		return {
			title: root.getElementsByTagName("title")[0]?.textContent ?? undefined,
			link: root.getElementsByTagName("link")[0]?.textContent ?? undefined,
			articles: articles
		};
	} else {
		return null;
	}
}

export function useFeed(url: string, dependents?: any[]): [Feed | undefined, any] {
	const intl = useIntl();

	if (!url) {
		return [undefined,
				intl.formatMessage({
					defaultMessage: "Missing feed URL."
				})];
	}

	const [data, error] = useXML(url, dependents);
	if (!data || error) {
		return [undefined, error];
	}

	const feed = parseFeed(data.children[0]);
	if (!feed) {
		return [undefined,
				intl.formatMessage({
					defaultMessage: "Error loading feed. Make sure it is an RSS or Atom feed."
				})];
	}

	return [feed, undefined];
}
