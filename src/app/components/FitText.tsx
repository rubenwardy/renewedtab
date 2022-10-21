import React, { CSSProperties, useRef } from "react"
import { clampNumber, mergeClasses } from "app/utils";
import { useElementSize } from "app/hooks/elementSize";

interface FitTextProps extends  React.HTMLAttributes<HTMLDivElement>{
	children: string[] | string;
	minFontSize?: number;
	maxFontSize?: number;
}


function getTextRatio(text: string):  number{
	const ele = document.createElement("span");
	ele.innerText = text;
	document.body.appendChild(ele);

	const rect = ele.getBoundingClientRect();
	document.body.removeChild(ele);
	return rect.height / rect.width;
}


/**
 * A constant to reduce the size of the text, to allow the
 * text to fit in without wrapping.
 */
const MAGIC_NUMBER = 0.7;


export default function FitText(props: FitTextProps) {
	const children = typeof props.children == "string" ? [ props.children ] : props.children

	const ref = useRef(null);
	const size = useElementSize(ref);
	const style: CSSProperties = {};
	if (size) {
		const desiredHeight = size.y;
		const widthToHeight = size.x * MAGIC_NUMBER * getTextRatio(children.join(""));
		const fontSize = clampNumber(Math.min(desiredHeight, widthToHeight),
				props.minFontSize ?? 20, props.maxFontSize ?? 200);
		const fontSizeProp = `${fontSize}px`;
		style.fontSize = fontSizeProp;
		style.lineHeight = fontSizeProp;
	}

	return (
		<div {...props}
				className={mergeClasses(props.className, "fittext")} ref={ref}>
			<span style={style}>
				{props.children}
			</span>
		</div>);
}
