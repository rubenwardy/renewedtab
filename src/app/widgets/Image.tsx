import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React from 'react';

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


Image.description = "Display an image, optionally making it a link";

Image.initialProps = {
	link: "",
	image_url: "https://placekitten.com/300/300"
};

Image.schema = {
	image_url: type.string("Image URL"),
	link: type.url("Link URL", "Optional, makes image a link"),
} as Schema;

Image.defaultSize = new Vector2(5, 5);
