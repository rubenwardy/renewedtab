import React from 'react';
import { useXML } from 'app/utils/hooks';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';

interface RSSProps {
	title?: string;
	url: string;
}

export default function RSS(props: RSSProps) {
	const [data, error] = useXML(props.url, [props.url]);

	if (!data) {
		return (
			<div className="panel text-muted">
				{error ? error.toString() : "Loading feed..."}
			</div>);
	}

	const rows: JSX.Element[] = [];
	data.querySelectorAll("item").forEach(el => {
		const link = el.querySelector("link")?.textContent as string;
		const title = el.querySelector("title")?.textContent as string;
		rows.push(<li key={link}><a href={link}>{title}</a></li>);
	});


	const title = (props.title && props.title.length > 0)
		? props.title
		: data.querySelector("channel > title")?.textContent;

	const link = data.querySelector("channel > link")?.textContent;
	const titleContent = link ? (<a href={link}>{title}</a>) : title;

	return (
		<div className="panel flush">
			<h2 className="panel-inset">{titleContent}</h2>
			<ul>
				{rows}
			</ul>
		</div>);
}


RSS.description = "Shows an RSS feed";

RSS.initialProps = {
	title: "",
	url: "http://feeds.bbci.co.uk/news/rss.xml"
};

RSS.schema = {
	title: type.string("Title", "Leave blank to use RSS feed's title"),
	url: type.urlPerm("URL"),
} as Schema;

RSS.defaultSize = new Vector2(5, 4);
