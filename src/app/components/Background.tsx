import { BackgroundConfig, BackgroundMode } from "app/hooks/background";
import { useAPI } from "app/hooks";
import React, { CSSProperties } from "react";

interface BackgroundProps {
	background: BackgroundConfig | null;
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

function AutoBackground() {
	const style: CSSProperties = {};

	const [info] = useAPI<BackgroundInfo>("background/", {}, []);
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
	const background = props.background;

	const style: CSSProperties = {};
	if (background) {
		switch (background.mode) {
		case BackgroundMode.Auto:
			return (<AutoBackground />)
		case BackgroundMode.Color:
			style.backgroundColor = background.values.color ?? "black";
			break;
		case BackgroundMode.ImageUrl:
			style.backgroundImage = `url('${background.values.url}')`;
			style.backgroundPosition = background.values.position;
			break;
		}
	}

	return (<div id="background" style={style} />);
}
