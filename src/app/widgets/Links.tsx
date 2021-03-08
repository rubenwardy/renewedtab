import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import React from 'react';

type Link = { title: string, url: string };
type LinkSection = { title: string, links: Link[] };

interface LinksProps {
	sections: LinkSection[];
}

export default function Links(props: LinksProps)  {
	const links = props.sections.map(section => [
			(<li className="section" key={section.title}>{section.title}</li>),
			section.links.map(link => (<li key={link.title}>
					<a href={link.url}>{link.title}</a>
				</li>))
		])
		.flat(10);

	return (
		<div className="panel flush">
			<ul className="large">{links}</ul>
		</div>)
}


Links.initialProps = {
	sections: [
		{
			title: "Homescreen",
			links: [
				{
					"title": "Source code",
					"url": "https://gitlab.com/rubenwardy/homescreen/"
				},
			]
		},
		{
			title: "rubenwardy",
			links: [
				{
					"title": "rubenwardy.com",
					"url": "https://rubenwardy.com/"
				},
				{
					"title": "@rubenwardy on Twitter",
					"url": "https://twitter.com/rubenwardy/"
				}
			]
		}
	]
};

Links.schema = {
	sections: "object",
} as Schema;

Links.defaultSize = new Vector2(5, 4);
