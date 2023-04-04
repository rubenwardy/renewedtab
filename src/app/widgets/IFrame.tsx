import Panel from 'app/components/Panel';
import { schemaMessages } from 'app/locale/common';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { onlyPanelThemeSchema, WidgetProps, WidgetType } from 'app/Widget';
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

function IFrame(widget: WidgetProps<IFrameProps>) {
	return (
		<Panel {...widget.theme} scrolling={false}>
			<iframe src={widget.props.url} width="100%" height="100%" frameBorder="0" />
		</Panel>);
}


const widget: WidgetType<IFrameProps> = {
	Component: IFrame,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 4),
	themeSchema: onlyPanelThemeSchema,
	initialProps: {
		url: "https://example.com",
	},
	schema: {
		url: type.url(schemaMessages.url),
	},
	initialTheme: {
		showPanelBG: false,
	}
};
export default widget;
