import schemaMessages from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	description: {
		defaultMessage: "Shows a webpage",
	},
});

interface IFrameProps {
	url: string;
}

export default function IFrame(props: WidgetProps<IFrameProps>) {
	return (
		<div className="panel flush">
			<iframe src={props.props.url} width="100%" height="100%" frameBorder="0" />
		</div>);
}


IFrame.description = messages.description;

IFrame.initialProps = {
	url: "https://example.com"
};

IFrame.schema = {
	url: type.url(schemaMessages.url),
} as Schema;

IFrame.defaultSize = new Vector2(5, 4);
