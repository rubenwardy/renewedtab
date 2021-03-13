import React from 'react';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';
import { useFeed } from 'app/hooks/feeds';

interface FeedProps {
	title?: string;
	url: string;
}

export default function Feed(props: FeedProps) {
	const [feed, error] = useFeed(props.url, [props.url]);

	if (!feed) {
		return (
			<div className="panel text-muted">
				{error ? error.toString() : "Loading feed..."}
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
	url: type.urlPerm("URL", "URL to an Atom or RSS feed"),
} as Schema;

Feed.defaultSize = new Vector2(5, 4);
