import { mergeClasses } from "app/utils";
import Color from "app/utils/Color";
import React from "react";

interface MeterProps {
	value: number;
	max: number;
	color?: string;
	className?: string;
}

export default function Meter(props: MeterProps) {
	const style: any = {};
	if (props.color && Color.fromString(props.color)) {
		style["--color-primary-light"] = props.color;
	}

	const perc = `${(100 * props.value / props.max).toFixed(0)}%`;

	return (
		<div className={mergeClasses("meter", props.className)} style={style}>
			<div className="bar" style={{ width: perc }} />
			<div className="label">{perc}</div>
		</div>);
}
