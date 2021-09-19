import LinkBox, { LinkSchema, LinkBoxProps, FullLinkSchema } from 'app/components/LinkBox';
import { type } from 'app/utils/Schema';
import uuid from 'app/utils/uuid';
import { Vector2 } from 'app/utils/Vector2';
import { defaultLinksThemeSchema, Widget, WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Links",
		description: "Links Widget",
	},

	description: {
		defaultMessage: "Links, with support for headings and icons",
		description: "Links widget description",
	},

	links: {
		defaultMessage: "Links",
		description: "Links widget: form field label",
	},

	enableCustomIcons: {
		defaultMessage: "Enable custom icons",
		description: "Links widget: form field label",
	},

	useWebsiteIcons: {
		defaultMessage: "Use icons from websites (favicons)",
		description: "Links widget: form field label",
	},
});


function Links(props: WidgetProps<LinkBoxProps>)  {
	return (<LinkBox {...props.props} widgetTheme={props.theme} />);
}


const initialProps: LinkBoxProps = {
	links: [
		{
			id: uuid(),
			title: "Renewed Tab",
			icon: "",
			url: "",
		},
		{
			id: uuid(),
			title: "Help and Support",
			icon: "",
			url: "https://renewedtab.com/help/"
		},
		{
			id: uuid(),
			title: "@RenewedTab on Twitter",
			icon: "",
			url: "https://twitter.com/RenewedTab/"
		},
		{
			id: uuid(),
			title: "Popular",
			icon: "",
			url: "",
		},
		{
			id: uuid(),
			title: "YouTube",
			icon: "",
			url: "https://www.youtube.com/"
		},
		{
			id: uuid(),
			title: "Wikipedia",
			icon: "",
			url: "https://en.wikipedia.org/"
		},
	],
};


const widget: WidgetType<LinkBoxProps> = {
	Component: Links,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 5),
	initialProps: initialProps,
	themeSchema: defaultLinksThemeSchema,

	async schema(widget) {
		const linkSchema = widget.props.enableCustomIcons ? FullLinkSchema : LinkSchema;
		if (typeof browser !== "undefined") {
			return {
				links: type.array(linkSchema, messages.links),
				enableCustomIcons: type.boolean(messages.enableCustomIcons),
				useWebsiteIcons: type.booleanHostPerm(messages.useWebsiteIcons),
			};
		} else {
			return {
				links: type.array(linkSchema, messages.links),
				enableCustomIcons: type.boolean(messages.enableCustomIcons),
			};
		}
	},

	async onLoaded(widget: Widget<any>) {
		if (widget.props.sections && !widget.props.links) {
			widget.props.links = widget.props.sections.map((section: any) => [
				{ title: section.title, url: "" },
				section.links
			]).flat(10).map((link: any) => {
				link.id = uuid();
				return link;
			});
		}

		if (typeof widget.props.useIconBar !== "undefined") {
			widget.theme.useIconBar = widget.props.useIconBar;
			widget.theme.showPanelBG = !widget.props.useIconBar;
			delete widget.props.useIconBar;
		}
	},
};
export default widget;
