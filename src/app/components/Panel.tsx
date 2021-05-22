import { WidgetTheme } from "app/Widget";
import React, { CSSProperties, ReactNode } from "react";


export interface PanelProps extends WidgetTheme {
	children: ReactNode;
	className?: string;

	/**
	 * Whether the content should scroll. Defaults to true.
	 */
	scrolling?: boolean;

	flush?: boolean;

	/**
	 * CSS classes to use when the panel bg is hidden
	 */
	invisClassName?: string;

	style?: CSSProperties;
}


export default function Panel(props: PanelProps) {
	const style = props.style ?? {};
	if (props.textColor) {
		style.color = style.color ?? props.textColor;
	}

	const className = [];
	if (props.showPanelBG) {
		className.push("panel");
		if (props.flush) {
			className.push("flush");
		}
		if (props.className) {
			className.push(props.className);
		}
	} else {
		className.push("panel-invis");
		className.push(props.invisClassName ?? "text-shadow-hard");
	}

	if (props.scrolling !== false) {
		className.push("scrollable");
	}

	return (
		<div className={className.join(" ")} style={style}>
			{props.children}
		</div>);
}
