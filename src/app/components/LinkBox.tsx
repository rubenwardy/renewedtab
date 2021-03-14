import Schema, { type } from 'app/utils/Schema';
import React from 'react';

export interface Link {
	id: string; //< used by React for keys.
	title: string;
	icon: string;
	url: string;
}

export const LinkSchema : Schema = {
	title: type.string("Title"),
	icon: type.url("Icon", "Optional, URL to image (18px recommended)"),
	url: type.url("URL", "Leave blank to make heading"),
};

export interface LinkBoxProps {
	useIconBar: boolean;
	links: Link[];
}

export default function LinkBox(props: LinkBoxProps)  {
	const requiresIcons = props.useIconBar;

	const links = props.links.map(link => {
		let icon: JSX.Element | undefined;
		if (requiresIcons || link.icon.length > 0) {
			if (link.icon.includes("/")) {
				icon = (<img className="icon" src={link.icon} />);
			} else if (link.icon.length > 0) {
				icon = (<i className={`fas ${link.icon} icon`} />);
			} else if (link.url.trim() != "") {
				icon = (<i className="fas fa-circle icon" />);
			}
		}

		if (link.url.trim() != "") {
			return (<li key={link.title}><a href={link.url}>{icon}{link.title}</a></li>);
		} else {
			return (<li key={link.title} className="section">{icon}{link.title}</li>);
		}
	});

	if (props.useIconBar) {
		return (
			<ul className="iconbar">{links}</ul>);
	} else {
		return (
			<div className="panel flush">
				<ul className="large">{links}</ul>
			</div>);
	}
}
