import { ActualBackgroundProps } from "app/backgrounds";
import Color from "app/utils/Color";
import React, { CSSProperties } from "react";
import { Credits } from "./Credits";


export default function ActualBackground(props: ActualBackgroundProps) {
	const style: CSSProperties = {};
	let overlayStyle: (CSSProperties | undefined) = undefined;

	if (props.color) {
		style.backgroundColor = props.color;
	}
	if (props.image) {
		style.backgroundImage = `url('${props.image}')`;

		const brightnessDark = props.brightnessDark ?? 100;
		const brightnessLight = props.brightnessLight ?? brightnessDark;
		const brightness =
			(props.color && (Color.fromString(props.color)?.luminance ?? 0) > 128)
				? brightnessLight : brightnessDark;

		style.filter = `brightness(${brightness ?? 100}%)`;

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
