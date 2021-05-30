import Panel from 'app/components/Panel';
import { schemaMessages } from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetTheme } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "IFrame",
		description: "IFrame Widget",
	},

	description: {
		defaultMessage: "Shows a webpage",
		description: "IFrame widget description",
	},
});

interface IFrameProps {
	url: string;
}

export default function IFrame(widget: WidgetProps<IFrameProps>) {
	return (
		<Panel {...widget.theme} scrolling={false}>
			<iframe src={widget.props.url} width="100%" height="100%" frameBorder="0" />
		</Panel>);
}


IFrame.title = messages.title;
IFrame.description = messages.description;

IFrame.initialProps = {
	url: "https://example.com"
};

IFrame.schema = {
	url: type.url(schemaMessages.url),
} as Schema;

IFrame.defaultSize = new Vector2(5, 4);

IFrame.initialTheme = {
	showPanelBG: false,
} as WidgetTheme;
