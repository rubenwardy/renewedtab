import React from 'react';
import { useXML } from 'app/utils/hooks';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';

interface FeedProps {
	title?: string;
	url: string;
}

interface Article {
	title: string;
	link: string;
}

interface Feed {
	title?: string;
	link?: string;
	articles: Article[];
}

function parseFeed(root: Element): Feed | null {
	const articles: Article[] = [];
	if (root.tagName == "rss") {
		root.querySelectorAll("item").forEach(el => {
			const link = el.querySelector("link")?.textContent as string;
			const title = el.querySelector("title")?.textContent as string;
			articles.push({ title: title, link: link })
		});

		return {
			title: root.querySelector("channel > title")?.textContent ?? undefined,
			link: root.querySelector("channel > link")?.textContent ?? undefined,
			articles: articles
		};
	} else if (root.tagName == "feed") {
		root.querySelectorAll("entry").forEach(el => {
			const link = el.querySelector("link")?.getAttribute("href") as string;
			const title = el.querySelector("title")?.textContent as string;
			articles.push({ title: title, link: link })
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

export default function Feed(props: FeedProps) {
	const [data, error] = useXML(props.url, [props.url]);

	if (!data) {
		return (
			<div className="panel text-muted">
				{error ? error.toString() : "Loading feed..."}
			</div>);
	}

	const feed = parseFeed(data.children[0]);
	if (!feed) {
		return (
			<div className="panel text-muted">
				Error loading feed. Make sure it is an RSS or Atom feed.
			</div>);

	}

	const rows = feed.articles.map(article =>
		(<li key={article.link}><a href={article.link}>{article.title}</a></li>));

	const title = (props.title && props.title.length > 0)
		? props.title
		: feed.title;

	const titleContent = feed.link ? (<a href={feed.link}>{title}</a>) : title;

	return (
		<div className="panel flush">
			<h2 className="panel-inset">{titleContent}</h2>
			<ul>
				{rows}
			</ul>
		</div>);
}


Feed.description = "Shows an Atom or RSS feed";

Feed.initialProps = {
	title: "",
	url: "http://feeds.bbci.co.uk/news/rss.xml"
};

Feed.schema = {
	title: type.string("Title", "Leave blank to use feed's title"),
	url: type.urlPerm("URL"),
} as Schema;

Feed.defaultSize = new Vector2(5, 4);
