import Schema, { type } from 'app/utils/Schema';
import uuid from 'app/utils/uuid';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetRaw } from 'app/WidgetManager';
import React from 'react';

interface Link {
	id: string; //< used by React for keys.
	title: string;
	icon: string;
	url: string;
}

const LinkSchema : Schema = {
	title: type.string("Title"),
	icon: type.url("Icon", "Optional, URL to image (18px recommended)"),
	url: type.url("URL", "Leave blank to make heading"),
};

interface LinksProps {
	useIconBar: boolean;
	links: Link[];
}

export default function Links(props: LinksProps)  {
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


Links.description = "Links, with support for headings and icons";

Links.initialProps = {
	useIconBar: false,
	links: [
		{
			id: uuid(),
			title: "Homescreen",
			icon: "",
			url: "",
		},
		{
			id: uuid(),
			title: "Website",
			icon: "",
			url: "https://homescreen.rubenwardy.com/"
		},
		{
			id: uuid(),
			title: "Donate",
			icon: "",
			url: "https://homescreen.rubenwardy.com/donate/"
		},
		{
			id: uuid(),
			title: "rubenwardy",
			icon: "",
			url: "",
		},
		{
			id: uuid(),
			title: "rubenwardy.com",
			icon: "",
			url: "https://rubenwardy.com/"
		},
		{
			id: uuid(),
			title: "@rubenwardy on Twitter",
			icon: "",
			url: "https://twitter.com/rubenwardy/"
		},
	]
};

Links.schema = {
	useIconBar: type.boolean("Display as icons"),
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

	if (widget.props.useIconBar === undefined) {
		widget.props.useIconBar = false;
		widget.props.links.forEach((link: Link) => {
			link.icon = "";
		})
	}
}
