import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React from 'react';

interface ButtonProps {
	url: string;
	text: string;
}

export default function Button(props: WidgetProps<ButtonProps>)  {
	return (
		<div className="panel flush">
			<ul className="large">
				<li>
					<a href={props.props.url}>{props.props.text}</a>
				</li>
			</ul>
		</div> );
}


Button.description = "A link button";

Button.initialProps = {
	url: "https://rubenwardy.com",
	text: "rubenwardy.com"
};

Button.schema = {
	url: type.url("URL"),
	text: type.string("Text"),
} as Schema;

Button.defaultSize = new Vector2(5, 1);
