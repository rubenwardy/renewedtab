import { FeedType } from ".";

interface FeedInfo {
	type: FeedType;
	url: string;
}


type Loader = (url: string) => (Element | null);


const LINK_SELECTOR = [
	"link[type='application/rss+xml']",
	"link[type='application/atom+xml']",
	"link[rel='alternate'][href$='.rss']",
	"link[rel='alternate'][href$='atom.xml']",
].join(", ");


function impl(url: string, loader: Loader, depth: number): (FeedInfo | null) {
	if (depth > 1) {
		return null;
	}

	const root = loader(url);
	if (!root) {
		return null;
	}

	if (root.tagName == "rss") {
		return {
			type: FeedType.Rss,
			url: url,
		};
	} else if (root.tagName == "feed") {
		return {
			type: FeedType.Atom,
			url: url,
		};
	} else if (root.tagName == "HTML") {
		const links = root.querySelectorAll(LINK_SELECTOR);
		if (links.length > 0) {
			const link = links[0];
			const linkUrl = new URL(link.getAttribute("href")!, url).toString();
			const ret = impl(linkUrl, loader, depth + 1);
			if (ret) {
				return ret;
			}
		}

	}

	return null
}



/**
 * Attempts to find RSS/Atom feed at URL
 *
 * @param url Url to check
 */
export function detectFeed(url: string, loader: Loader): (FeedInfo | null) {
	{
		const ret = impl(url, loader, 0);
		if (ret) {
			return ret;
		}
	}

	for (const pathname of ["/feed", "/rss"]) {
		const feedUrl = new URL(url);
		feedUrl.pathname = pathname;
		console.log(feedUrl.toString());
		const ret = impl(feedUrl.toString(), loader, 0);
		if (ret) {
			return ret;
		}
	}

	return null;
}
