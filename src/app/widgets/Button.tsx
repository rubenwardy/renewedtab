import Panel from 'app/components/Panel';
import schemaMessages from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	description: {
		defaultMessage: "A link button",
	},
});

interface ButtonProps {
	url: string;
	text: string;
}

export default function Button(props: WidgetProps<ButtonProps>)  {
	return (
		<Panel {...props.theme} flush={true}>
			<ul className="large">
				<li>
					<a href={props.props.url}>{props.props.text}</a>
				</li>
			</ul>
		</Panel> );
}


Button.description = messages.description;

Button.initialProps = {
	url: "https://rubenwardy.com",
	text: "rubenwardy.com"
};

Button.schema = {
	url: type.url(schemaMessages.url),
	text: type.string(schemaMessages.text),
} as Schema;

Button.defaultSize = new Vector2(5, 1);
