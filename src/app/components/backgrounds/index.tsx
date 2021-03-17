import { BackgroundConfig, BackgroundMode } from "app/hooks/background";
import React, { CSSProperties } from "react";


export interface BackgroundInfo {
	id: string;
	title?: string;
	color?: string;
	url: string;
	author: string;
	site: string;
	links: {
		photo: string;
		author: string;
		site: string;
	};
}

export interface BackgroundProps {
	background: BackgroundConfig | null;
	setWidgetsHidden?: (value: boolean) => void;
}


import AutoBackground from "./AutoBackground";
import UnsplashBackground from "./UnsplashBackground";


export default function Background(props: BackgroundProps) {
	const background = props.background;

	const style: CSSProperties = {};
	if (background) {
		switch (background.mode) {
		case BackgroundMode.Auto:
			return (<AutoBackground {...props} />);
		case BackgroundMode.Color:
			style.backgroundColor = background.values.color ?? "#336699";
			break;
		case BackgroundMode.ImageUrl:
			style.backgroundImage = `url('${background.values.url}')`;
			style.backgroundPosition = background.values.position;
			break;
		case BackgroundMode.Unsplash:
			return (<UnsplashBackground {...props} />);
		}
	}

	return (<div id="background" style={style} />);
}
