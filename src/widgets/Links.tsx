import React from 'react';
import { Widget } from '../Widget';

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
			<ul>{links}</ul>
		</div>)
}
