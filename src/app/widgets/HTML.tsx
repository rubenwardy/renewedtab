import Panel from 'app/components/Panel';
import { schemaMessages } from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetTheme } from 'app/Widget';
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

	htmlHint: {
		defaultMessage: "Be careful with what you paste here. An attacker could get you to paste code here that steals things the extension has access to - such as browser history and top sites.",
		description: "HTML widget: form field hint (HTML)"
	}
});

interface HTMLProps {
	html: string;
}

export default function HTML(widget: WidgetProps<HTMLProps>) {
	return (
		<Panel {...widget.theme} scrolling={false}>
			<div dangerouslySetInnerHTML={{__html: widget.props.html}} />
		</Panel>);
}


HTML.title = messages.title;
HTML.description = messages.description;
HTML.initialProps = {
	html: "Hello <b>World</b>"
};

HTML.schema = {
	html: type.textarea(messages.html, messages.htmlHint),
} as Schema;

HTML.defaultSize = new Vector2(5, 4);
