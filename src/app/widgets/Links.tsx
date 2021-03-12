import Schema, { type } from 'app/utils/Schema';
import uuid from 'app/utils/uuid';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetRaw } from 'app/WidgetManager';
import React from 'react';

interface Link {
	id: string; //< used by React for keys.
	title: string;
	url: string;
}

const LinkSchema : Schema = {
	title: type.string("Title"),
	url: type.url("URL", "Leave blank to make heading"),
};

interface LinksProps {
	links: Link[];
}

export default function Links(props: LinksProps)  {
	const links = props.links.map(link => {
		if (link.url.trim() != "") {
			return (<li key={link.title}><a href={link.url}>{link.title}</a></li>);
		} else {
			return (<li key={link.title} className="section">{link.title}</li>);
		}
	});

	return (
		<div className="panel flush">
			<ul className="large">{links}</ul>
		</div>)
}


Links.description = "A list of links, with support for headings";

Links.initialProps = {
	links: [
		{
			id: uuid(),
			title: "Homescreen",
			url: "",
		},
		{
			id: uuid(),
			title: "Source code",
			url: "https://gitlab.com/rubenwardy/homescreen/"
		},
		{
			id: uuid(),
			title: "rubenwardy",
			url: "",
		},
		{
			id: uuid(),
			title: "rubenwardy.com",
			url: "https://rubenwardy.com/"
		},
		{
			id: uuid(),
			title: "@rubenwardy on Twitter",
			url: "https://twitter.com/rubenwardy/"
		},
	]
};

Links.schema = {
	links: type.array(LinkSchema, "Links"),
} as Schema;

Links.defaultSize = new Vector2(5, 4);

Links.onLoaded = function(widget: WidgetRaw<any>) {
	if (widget.props.sections && !widget.props.links) {
		widget.props.links = widget.props.sections.map((section: any) => [
			{ title: section.title, url: "" },
			section.links
		]).flat(10).map((link: any) => {
			link.id = uuid();
			return link;
		});
	}
}
