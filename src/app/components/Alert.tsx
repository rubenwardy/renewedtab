import React from "react";

export interface AlertButton {
	text: string;
	icon?: string;
	onClick?: () => void;
	url?: string;
}

interface AlertProps {
	message: string;
	buttons: AlertButton[];
	onButtonClick?: (btn: AlertButton) => void;
}

export function Alert(props: AlertProps) {
	function onClick(button: AlertButton) {
		if (button.onClick) {
			button.onClick();
		}

		if (props.onButtonClick) {
			props.onButtonClick(button);
		}

		if (button.url) {
			window.location.href = button.url;
		}
	}

	const buttons = props.buttons.map(button => (
		<a key={button.text} className="btn" onClick={() => onClick(button)}
				title={button.icon && button.text}>
			{button.icon ? <i className={`fas ${button.icon}`} /> : button.text}
		</a>))

	return (
		<div className="alert alert-modal">
			<span className="alert-body">
				{props.message}
			</span>
			{buttons}
		</div>);
}
