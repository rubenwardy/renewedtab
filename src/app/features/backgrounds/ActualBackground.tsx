import { ActualBackgroundProps, GradientType } from "./providers/common";
import Color from "app/utils/Color";
import { enumToValue } from "app/utils/enum";
import React, { CSSProperties } from "react";
import { Credits } from "./Credits";


export default function ActualBackground(props: ActualBackgroundProps) {
	const style: CSSProperties = {};
	let overlayStyle: (CSSProperties | undefined) = undefined;

	if (props.color) {
		style.backgroundColor = props.color;
	}

	if (props.gradientColors) {
		const colors = props.gradientColors.map(x => `${x.color} ${x.stop}%`);
		let gradient = "";

		switch (enumToValue(GradientType, props.gradientType ?? GradientType.Vertical)) {
		case GradientType.Horizontal:
			gradient = "linear-gradient(to right, ";
			break;
		case GradientType.Radial:
			gradient = "radial-gradient(circle, ";
			break;
		case GradientType.Vertical:
		default:
			gradient = "linear-gradient(to bottom, ";
			break;
		}

		style.backgroundImage = `${gradient}${colors.join(", ")})`;
	} else if (props.image) {
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
