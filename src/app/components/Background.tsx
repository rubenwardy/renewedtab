import { BackgroundMode } from "app/BackgroundStore";
import { useAPI } from "app/utils/hooks";
import React, { CSSProperties } from "react";

interface BackgroundProps {
	mode: BackgroundMode;
	values: any;
}

interface BackgroundInfo {
	title?: string;
	color?: string;
	url: string;
	author: string;
	site: string;
	link: string;
}

function Credits(props: BackgroundInfo) {
	return (
		<div className="credits text-shadow-soft">
			<a href={props.link}>
				<span className="title">{props.title}</span>
				<span>
					{props.author} / {props.site}
				</span>
			</a>
		</div>);
}

function AutoBackground(props: BackgroundProps) {
	const style: CSSProperties = {};

	const [info, error] = useAPI<BackgroundInfo>("background/", {}, [props.values]);
	if (info) {
		if (info.color) {
			style.backgroundColor = info.color;
		}
		style.backgroundImage = `url('${info.url}')`;
		return (
			<>
				<div id="background" style={style} />
				<Credits {...info} />
			</>);
	} else {
		return (<div id="background" style={style} />);
	}
}

export default function Background(props: BackgroundProps) {
	const style: CSSProperties = {};

	switch (props.mode) {
	case BackgroundMode.Auto:
		return (<AutoBackground {...props} />)
	case BackgroundMode.Color:
		style.backgroundColor = props.values.color ?? "black";
		break;
	case BackgroundMode.ImageUrl:
		style.backgroundImage = `url('${props.values.url}')`;
		style.backgroundPosition = props.values.position;
		break;
	}

	return (<div id="background" style={style} />);
}
