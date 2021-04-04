import Schema, { type } from 'app/utils/Schema';
import React, { useState } from 'react';


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


interface IconProps {
	icon: string;
	requiresIcons: boolean;
	defaultIcon?: string;
	errorIcon?: string;
}

function Icon(props: IconProps) {
	const [errored, setErrored] = useState(false);

	if (!props.requiresIcons && props.icon.length == 0) {
		return null;
	} else if (errored) {
		console.log("Error icon");
		return (<span><i className={`fas ${props.errorIcon ?? "fa-times"} icon`} /></span>);
	} else if (props.icon.includes("/")) {
		console.log("URL icon");
		return (<img className="icon" src={props.icon} onError={() => setErrored(true)} />);
	} else if (props.icon.startsWith("fa-")) {
		console.log("FA icon");
		return (<span><i className={`fas ${props.icon} icon`} /></span>);
	} else {
		console.log("Placeholder icon");
		return (<span><i className={`fas ${props.defaultIcon ?? "fa-circle"} icon`} /></span>);
	}
}


export interface LinkBoxProps {
	useIconBar: boolean;
	links: Link[];
	defaultIcon?: string;
	errorIcon?: string;
}

export default function LinkBox(props: LinkBoxProps)  {
	const links = props.links.map(link => {
		const requiresIcons = props.useIconBar && link.url.trim() != "";
		const icon = (
			<Icon icon={link.icon} requiresIcons={requiresIcons}
				defaultIcon={props.defaultIcon} errorIcon={props.errorIcon} />);

		if (link.url.trim() != "") {
			return (
				<li key={link.title + link.url}>
					<a href={link.url}>
						{icon}
						<span className="title">{link.title}</span>
					</a>
				</li>);
		} else {
			return (
				<li key={link.title} className="section">
					{icon}
					<span className="title">{link.title}</span>
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
