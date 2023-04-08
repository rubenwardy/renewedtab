import { FeedInfo, FeedType } from ".";


type Loader = (url: string) => Promise<Element | null>;


const LINK_SELECTOR = [
	"link[type='application/rss+xml']",
	"link[type='application/atom+xml']",
	"link[rel='alternate'][href$='.rss']",
	"link[rel='alternate'][href$='atom.xml']",
].join(", ");


async function impl(url: string, loader: Loader, depth: number): Promise<FeedInfo[]> {
	if (depth > 1) {
		return [];
	}

	const root = await loader(url);
	if (!root) {
		console.log("- no root");
		return [];
	}

	console.log(root.tagName);

	if (root.tagName == "rss") {
		return [
			{
				type: FeedType.Rss,
				url: url,
				title: "",
				numberOfArticles: 0,
				numberOfImages: 0,
			}
		];
	} else if (root.tagName == "feed") {
		return [
			{
				type: FeedType.Atom,
				url: url,
				title: "",
				numberOfArticles: 0,
				numberOfImages: 0,
			}
		];
	} else if (root.tagName == "HTML") {
		const links = root.querySelectorAll(LINK_SELECTOR);
		console.log([...links].map(x => x.outerHTML));
		if (links.length > 0) {
			const res = await Promise.allSettled([...links].map(async (link) => {
				const linkUrl = new URL(link.getAttribute("href")!, url).toString();
				return (await impl(linkUrl, loader, depth + 1)).map(x =>
					({ ...x, title: link.getAttribute("title") ?? x.title }));

			}));

			return res.filter(x => x.status == "fulfilled")
				.flatMap(x => (x as PromiseFulfilledResult<FeedInfo[]>).value);
		}
	}

	return [];
}



/**
 * Attempts to find RSS/Atom feed at URL
 *
 * @param url Url to check
 */
export async function detectFeed(url: string, loader: Loader): Promise<FeedInfo[]> {
	return await impl(url, loader, 0);
}
