import { schemaMessages } from 'app/locale/common';
import Color from 'app/utils/Color';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetTheme } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Button",
		description: "Button Widget",
	},

	description: {
		defaultMessage: "A link button",
	},
});

interface ButtonProps {
	url: string;
	text: string;
}

export default function Button(props: WidgetProps<ButtonProps>)  {
	const color = Color.fromString(props.theme.color ?? "") ?? Color.fromString("#007DB8")!;
	color.a = Math.min(100, Math.max(0, props.theme.opacity ?? 100)) / 100;
	const style: any = {
		"--color-button": color.rgba,
		"--color-button-lighter": color.lighten(1.3).rgba,
	};

	return (
		<a href={props.props.url}
				className="btn btn-custom btn-blur middle-center" style={style}>
			{props.props.text}
		</a>);
}


Button.title = messages.title;
Button.description = messages.description;

Button.initialProps = {
	url: "https://rubenwardy.com",
	text: "rubenwardy.com",
};

Button.schema = {
	url: type.url(schemaMessages.url),
	text: type.string(schemaMessages.text),
} as Schema;

Button.defaultSize = new Vector2(5, 1);

Button.themeSchema = {
	color: type.color(schemaMessages.color),
	opacity: type.unit_number(schemaMessages.opacity, "%"),
};

Button.initialTheme = {
	showPanelBG: false,
	useIconBar: false,
	color: "#007DB8",
	opacity: 40,
} as WidgetTheme;
