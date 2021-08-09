import React, { CSSProperties } from "react";
import { CreditProps, Credits } from "./Credits";

interface ActualBackgroundProps {
	image?: string;
	color?: string;
	brightness?: number;
	blur?: number;
	credits?: CreditProps;
	position?: string;
}


export default function ActualBackground(props: ActualBackgroundProps) {
	const style: CSSProperties = {};
	let overlayStyle: (CSSProperties | undefined) = undefined;

	if (props.color) {
		style.backgroundColor = props.color;
	}
	if (props.image) {
		style.backgroundImage = `url('${props.image}')`;
		style.filter = `brightness(${props.brightness ?? 100}%)`;

		if (props.blur && props.blur > 0) {
			overlayStyle = {};
			overlayStyle.backdropFilter = `blur(${props.blur ?? 0}px)`;
		}
	}
	if (props.position) {
		style.backgroundPosition = props.position;
	}

	return (
		<>
			<div id="background" style={style} />
			{overlayStyle &&
				<div id="background-overlay" style={overlayStyle} />}
			{props.credits &&
				<Credits {...props.credits}  />}
		</>);
}
