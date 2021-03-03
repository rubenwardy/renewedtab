import React from 'react';
import { useXML } from 'app/utils/hooks';

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
			? (<h2 className="panel-inset">{props.title}</h2>) : null;

	return (
		<div className="panel flush">
			{title}
			<ul className="scrolling">
				{rows}
			</ul>
		</div>);
}


RSS.defaultProps = {
	title: "BBC News",
	url: "http://feeds.bbci.co.uk/news/rss.xml"
};
