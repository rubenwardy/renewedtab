import { Vector2 } from 'app/utils/Vector2';
import React from 'react';

interface ButtonProps {
	url: string;
	text: string;
}

export default function Button(props: ButtonProps)  {
	return (
		<div className="panel flush">
			<ul className="large">
				<li>
					<a href={props.url}>{props.text}</a>
				</li>
			</ul>
		</div> );
}


Button.defaultProps = {
	url: "https://rubenwardy.com",
	text: "rubenwardy.com"
};

Button.defaultSize = new Vector2(5, 1);
