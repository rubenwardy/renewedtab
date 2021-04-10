import React from 'react';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';
import { useFeed } from 'app/hooks/feeds';
import { WidgetProps } from 'app/Widget';


interface WebComicProps {
	url: string;
}

export default function WebComic(widget: WidgetProps<WebComicProps>) {
	const props = widget.props;

	const [feed, error] = useFeed(props.url, [props.url]);

	if (!feed) {
		return (
			<div className="panel text-muted">
				{error ? error.toString() : "Loading feed..."}
			</div>);
	}

	const article = feed.articles[0];
	if (article?.image == undefined) {
		return (
			<div className="panel text-muted">
				No image found on feed
			</div>);
	}

	const title = article.title;
	return (
		<div className="panel">
			<a href={article.link} title={article.alt ?? ""}>
				<img src={article.image} alt={article.alt ?? ""} />
			</a>
			<h2><a href={article.link}>{title}</a></h2>
		</div>);
}


WebComic.description = "Shows the most recent page from a webcomic, using Atom or RSS";

WebComic.initialProps = {
	url: "https://xkcd.com/atom.xml"
};

WebComic.schema = {
	url: type.urlPerm("Feed URL", "URL to an Atom or RSS feed"),
} as Schema;

WebComic.defaultSize = new Vector2(5, 4);
