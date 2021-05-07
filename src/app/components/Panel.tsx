import { WidgetTheme } from "app/Widget";
import React, { ReactNode } from "react";


export interface PanelProps extends WidgetTheme {
	children: ReactNode;
	className?: string;

	flush?: boolean;

	/**
	 * Whether to still wrap the content in a div if showPanelBG is false.
	 */
	noBgWrap?: boolean;
}


export default function Panel(props: PanelProps) {
	if (!props.showPanelBG) {
		if (props.noBgWrap) {
			return (<div className={props.className}>{props.children}</div>);
		} else {
			return (<>{props.children}</>);
		}
	}

	let className = ["panel"];
	if (props.flush) {
		className.push("flush");
	}
	if (props.className) {
		className.push(props.className);
	}

	return (
		<div className={className.join(" ")}>
			{props.children}
		</div>);
}
