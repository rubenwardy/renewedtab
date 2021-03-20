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


function Icon(props: { icon: string, requiresIcons: boolean }) {
	if (!props.requiresIcons && props.icon.length == 0) {
		return null;
	} else if (props.icon.includes("/")) {
		console.log("URL icon");
		return (<img className="icon" src={props.icon} />);
	} else if (props.icon.startsWith("fa-")) {
		console.log("FA icon");
		return (<span><i className={`fas ${props.icon} icon`} /></span>);
	} else {
		console.log("Placeholder icon");
		return (<span><i className="fas fa-circle icon" /></span>);
	}
}


export interface LinkBoxProps {
	useIconBar: boolean;
	links: Link[];
}

export default function LinkBox(props: LinkBoxProps)  {
	const links = props.links.map(link => {
		const requiresIcons = props.useIconBar && link.url.trim() != "";
		if (link.url.trim() != "") {
			return (
				<li key={link.title + link.url}>
					<a href={link.url}>
						<Icon icon={link.icon} requiresIcons={requiresIcons} />
						<span>{link.title}</span>
					</a>
				</li>);
		} else {
			return (
				<li key={link.title} className="section">
					<Icon icon={link.icon} requiresIcons={requiresIcons} />
					<span>{link.title}</span>
				</li>);
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
