import { BackgroundConfig, BackgroundMode } from "app/hooks/background";
import { useAPI } from "app/hooks";
import React, { CSSProperties } from "react";


interface BackgroundInfo {
	title?: string;
	color?: string;
	url: string;
	author: string;
	site: string;
	link: string;
}


interface CreditProps {
	info: BackgroundInfo;
	setIsHovered?: (value: boolean) => void;
}

function Credits(props: CreditProps) {
	const setIsHovered = props.setIsHovered ?? (() => {});

	return (
		<div className="credits text-shadow-soft"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
			<a href={props.info.link}>
				<span className="title">{props.info.title}</span>
				<span>
					{props.info.author} / {props.info.site}
				</span>
			</a>
		</div>);
}


interface BackgroundProps {
	background: BackgroundConfig | null;
	setWidgetsHidden?: (value: boolean) => void;
}

function AutoBackground(props: BackgroundProps) {
	const style: CSSProperties = {};

	const [info, error] = useAPI<BackgroundInfo>("background/", {}, []);
	if (info) {
		if (info.color) {
			style.backgroundColor = info.color;
		}
		style.backgroundImage = `url('${info.url}')`;
		return (
			<>
				<div id="background" style={style} />
				<Credits info={info} setIsHovered={props.setWidgetsHidden} />
			</>);
	} else {
		if (error) {
			style.backgroundColor = props.background!.values.color ?? "#336699";
		}
		return (<div id="background" style={style} />);
	}
}

export default function Background(props: BackgroundProps) {
	const background = props.background;

	const style: CSSProperties = {};
	if (background) {
		switch (background.mode) {
		case BackgroundMode.Auto:
			return (<AutoBackground {...props} />)
		case BackgroundMode.Color:
			style.backgroundColor = background.values.color ?? "#336699";
			break;
		case BackgroundMode.ImageUrl:
			style.backgroundImage = `url('${background.values.url}')`;
			style.backgroundPosition = background.values.position;
			break;
		}
	}

	return (<div id="background" style={style} />);
}
