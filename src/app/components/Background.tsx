import { BackgroundMode } from "app/BackgroundStore";
import { useAPI } from "app/utils/hooks";
import React, { CSSProperties } from "react";

interface BackgroundProps {
	mode: BackgroundMode;
	values: any;
}

interface BackgroundInfo {
	image_url: string;
	author: { title: string, url?: string };
	site: { title: string, url?: string };
	url: string;
}

function Credits(props: BackgroundInfo) {
	return (
		<div className="credits">
			<span>
				<a href={props.author.url ?? props.url}>{props.author.title}</a>
				&nbsp;/&nbsp;
				<a href={props.site.url}>{props.site.title}</a>
			</span>
		</div>);
}

function AutoBackground(props: BackgroundProps) {
	const style: CSSProperties = {};

	const [info, error] = useAPI<BackgroundInfo>("background/", {}, [props.values]);
	if (info) {
		style.backgroundImage = `url('${info.image_url}')`;
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
