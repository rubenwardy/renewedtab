import React, { CSSProperties } from "react"
import { useElementSize } from "app/hooks"
import { clampNumber, mergeClasses } from "app/utils";

interface FitTextProps extends  React.HTMLAttributes<HTMLDivElement>{
	children: string[];
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


export default function FitText(props: FitTextProps) {
	const [ref, size] = useElementSize();
	const style: CSSProperties = {};
	if (size) {
		const desiredHeight = size.y;
		const widthToHeight = size.x * 0.8 * getTextRatio(props.children.join(""));
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
