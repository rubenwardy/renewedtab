import LinkBox, { Link, LinkSchema, LinkBoxProps } from 'app/components/LinkBox';
import schemaMessages from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import uuid from 'app/utils/uuid';
import { Vector2 } from 'app/utils/Vector2';
import { Widget, WidgetProps } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	description: {
		defaultMessage: "Links, with support for headings and icons",
	},

	links: {
		defaultMessage: "Link",
	},

	useWebsiteIcons: {
		defaultMessage: "Use icons from websites (favicons)",
	},
});


export default function Links(props: WidgetProps<LinkBoxProps>)  {
	return (<LinkBox {...props.props} />);
}


Links.description = messages.description;

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
			useIconBar: type.boolean(schemaMessages.useIconBar),
			useWebsiteIcons: type.booleanHostPerm(messages.useWebsiteIcons),
			links: type.array(LinkSchema, messages.links),
		} as Schema;
	} else {
		return {
			useIconBar: type.boolean(schemaMessages.useIconBar),
			links: type.array(LinkSchema, messages.links),
		} as Schema;
	}
}

Links.defaultSize = new Vector2(5, 4);

Links.onLoaded = async (widget: Widget<any>) => {
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
