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
			title: "Minetest",
			links: [
				{
					"title": "ContentDB Audit Log",
					"url": "https://content.minetest.net/admin/audit/"
				},
				{
					"title": "GitHub",
					"url": "https://github.com/notifications"
				},
				{
					"title": "CTF Monitor",
					"url": "https://monitor.rubenwardy.com/d/9TgIegyGk/ctf"
				},
			]
		},
		{
			title: "Interesting reads",
			links: [
				{
					"title": "UX StackExchange",
					"url": "https://ux.stackexchange.com"
				},
				{
					"title": "UX Collective",
					"url": "https://uxdesign.cc/"
				}
			]
		}
	]
};

Links.schema = {
	sections: "object",
} as Schema;

Links.defaultSize = new Vector2(5, 5);
