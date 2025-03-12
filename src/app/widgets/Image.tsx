import Panel from 'app/components/Panel';
import { schemaMessages } from 'app/locale/common';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { onlyPanelThemeSchema, WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Image",
		description: "Image Widget",
	},

	description: {
		defaultMessage: "Display an image, optionally making it a link",
		description: "Image widget description",
	},

	linkHint: {
		defaultMessage: "Optional, makes image a link",
		description: "Image widget: Form field hint (Link)",
	},
});

interface ImageProps {
	image_url: string;
	link: string;
}

function Image(props: WidgetProps<ImageProps>) {
	const data = props.props;

	return (
		<Panel {...props.theme} scrolling={false}>
			{((data.link ?? "").length > 0)
				? (<a href={data.link}><img src={data.image_url} /></a>)
				: (<img src={data.image_url} />)}
		</Panel>
	);
}


const widget: WidgetType<ImageProps> = {
	Component: Image,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 5),
	themeSchema: onlyPanelThemeSchema,
	initialProps: {
		link: "",
		image_url: "https://placekitten.com/300/300"
	},
	schema: {
		image_url: type.string(schemaMessages.imageUrl),
		link: type.url(schemaMessages.linkUrl, messages.linkHint),
	},
	initialTheme: {
		showPanelBG: false,
	},
};
export default widget;
