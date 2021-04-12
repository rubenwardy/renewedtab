import LinkBox, { Link, LinkSchema, LinkBoxProps } from 'app/components/LinkBox';
import Schema, { type } from 'app/utils/Schema';
import uuid from 'app/utils/uuid';
import { Vector2 } from 'app/utils/Vector2';
import { Widget, WidgetProps } from 'app/Widget';
import React from 'react';


export default function Links(props: WidgetProps<LinkBoxProps>)  {
	return (<LinkBox {...props.props} />);
}


Links.description = "Links, with support for headings and icons";

Links.initialProps = {
	useIconBar: false,
	links: [
		{
			id: uuid(),
			title: "Renewed Tab",
			icon: "",
			url: "",
		},
		{
			id: uuid(),
			title: "Website",
			icon: "",
			url: "https://renewedtab.rubenwardy.com/"
		},
		{
			id: uuid(),
			title: "Donate",
			icon: "",
			url: "https://renewedtab.rubenwardy.com/donate/"
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

Links.schema = (_widget: Widget<LinkBoxProps>) => {
	if (typeof browser !== "undefined") {
		return {
			useIconBar: type.boolean("Display as icons"),
			useWebsiteIcons: type.booleanHostPerm("Use icons from websites (favicons)"),
			links: type.array(LinkSchema, "Links"),
		} as Schema;
	} else {
		return {
			useIconBar: type.boolean("Display as icons"),
			links: type.array(LinkSchema, "Links"),
		} as Schema;
	}
}

Links.defaultSize = new Vector2(5, 4);

Links.onLoaded = function(widget: Widget<any>) {
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
