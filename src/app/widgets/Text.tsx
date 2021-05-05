import schemaMessages from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	description: {
		defaultMessage: "Show a message",
	},
});

interface TextProps
{
	text: string;
}

export default function Text(props: WidgetProps<TextProps>)  {
	return (
		<div className="text-shadow-hard scrollable medium">
			{props.props.text}
		</div> );
}


Text.description = messages.description;

Text.initialProps = {
	text: "Hello world",
};

Text.schema = {
	text: type.textarea(schemaMessages.text),
} as Schema;

Text.defaultSize = new Vector2(5, 1);
