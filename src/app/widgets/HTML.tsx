import Panel from 'app/components/Panel';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "HTML",
		description: "HTML Widget",
	},

	description: {
		defaultMessage: "Custom HTML",
		description: "HTML widget description",
	},

	html: {
		defaultMessage: "HTML",
		description: "HTML widget: form field label",
	},
});

interface HTMLProps {
	html: string;
}

function HTML(props: WidgetProps<HTMLProps>) {
	return (
		<Panel {...props.theme} scrolling={false}>
			<div dangerouslySetInnerHTML={{__html: props.props.html}} />
		</Panel>);
}


const widget: WidgetType<HTMLProps> = {
	Component: HTML,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 4),
	initialProps: {
		html: "Hello <b>World</b>"
	},
	schema: {
		html: type.textarea(messages.html),
	},
};
export default widget;
