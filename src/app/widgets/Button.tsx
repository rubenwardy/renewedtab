import { schemaMessages } from 'app/locale/common';
import { clampNumber, mergeClasses } from 'app/utils';
import Color from 'app/utils/Color';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { themeMessages, WidgetProps, WidgetTheme } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Button",
		description: "Button Widget",
	},

	description: {
		defaultMessage: "A link button",
		description: "Button widget description",
	},

	tintOpacityHint: {
		defaultMessage: "Sets the opacity of the button tinted color",
		description: "Button widget: form field hint (Opacity)",
	},
});

interface ButtonProps {
	url: string;
	text: string;
}

export default function Button(props: WidgetProps<ButtonProps>)  {
	const color = Color.fromString(props.theme.color ?? "") ?? Color.fromString("#007DB8")!;
	color.a = clampNumber(props.theme.opacity ?? 100, 0, 100) / 100;
	const style: any = {
		"--color-button": color.rgba,
		"--color-button-lighter": color.rgba,
	};

	const className = mergeClasses(
			"btn btn-custom middle-center btn-brighten",
			(props.theme.showPanelBG !== false) && "blur");

	return (
		<a href={props.props.url} style={style} className={className}>
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
	showPanelBG: type.boolean(themeMessages.showPanelBG),
	color: type.color(schemaMessages.color),
	opacity: type.unit_number(schemaMessages.opacity, "%", messages.tintOpacityHint, 0, 100),
};

Button.initialTheme = {
	showPanelBG: true,
	useIconBar: false,
	color: "#007DB8",
	opacity: 40,
} as WidgetTheme;
