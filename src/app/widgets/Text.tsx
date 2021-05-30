import Panel from 'app/components/Panel';
import { schemaMessages } from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetTheme } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Text",
		description: "Text Widget",
	},

	description: {
		defaultMessage: "Show a message",
		description: "Text widget description"
	},
});

interface TextProps
{
	text: string;
}

export default function Text(widget: WidgetProps<TextProps>)  {
	return (
		<Panel {...widget.theme}>
			<div className="medium">
				{widget.props.text}
			</div>
		</Panel>);
}


Text.title = messages.title;
Text.description = messages.description;

Text.initialProps = {
	text: "Hello world",
};

Text.schema = {
	text: type.textarea(schemaMessages.text),
} as Schema;

Text.defaultSize = new Vector2(5, 1);

Text.initialTheme = {
	showPanelBG: false,
} as WidgetTheme;
