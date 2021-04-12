import schemaMessages from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	description: {
		defaultMessage: "Display an image, optionally making it a link",
	},

	imageUrl: {
		defaultMessage: "Image URL",
	},

	linkHint: {
		defaultMessage: "Optional, makes image a link",
	},
});

interface ImageProps {
	image_url: string;
	link: string;
}

export default function Image(widget: WidgetProps<ImageProps>) {
	const props = widget.props;

	if ((props.link ?? "").length > 0) {
		return (<a href={props.link}><img src={props.image_url} /></a>);
	} else {
		return (<img src={props.image_url} />);
	}
}


Image.description = messages.description;

Image.initialProps = {
	link: "",
	image_url: "https://placekitten.com/300/300"
};

Image.schema = {
	image_url: type.string(messages.imageUrl),
	link: type.url(schemaMessages.linkUrl, messages.linkHint),
} as Schema;

Image.defaultSize = new Vector2(5, 5);
