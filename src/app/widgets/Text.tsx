import Panel from 'app/components/Panel';
import { schemaMessages } from 'app/locale/common';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetType } from 'app/Widget';
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

function Text(widget: WidgetProps<TextProps>)  {
	return (
		<Panel {...widget.theme}>
			<div className="medium">
				{widget.props.text}
			</div>
		</Panel>);
}


const widget: WidgetType<TextProps> = {
	Component: Text,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 1),
	initialProps: {
		text: "Hello world",
	},
	schema: {
		text: type.textarea(schemaMessages.text),
	},
	initialTheme: {
		showPanelBG: false,
	},
};
export default widget;
