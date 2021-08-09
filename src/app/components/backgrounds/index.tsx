import { BackgroundConfig, BackgroundMode } from "app/hooks/background";
import React, { CSSProperties } from "react";
import ActualBackground from "./ActualBackground";


export interface BackgroundProps {
	background: BackgroundConfig | null;
	setWidgetsHidden?: (value: boolean) => void;
}


import AutoBackground from "./AutoBackground";
import ImageBackground from "./ImageBackground";
import UnsplashBackground from "./UnsplashBackground";


export default function Background(props: BackgroundProps) {
	const background = props.background;

	const style: CSSProperties = {};
	if (background) {
		switch (background.mode) {
		case BackgroundMode.Auto:
			return (<AutoBackground {...props} />);
		case BackgroundMode.Color:
			return (<ActualBackground color={background.values.color ?? "#336699"} />);
		case BackgroundMode.Image:
			return (<ImageBackground {...props} />);
		case BackgroundMode.ImageUrl:
			style.backgroundColor = props.background!.values.color ?? "#336699";
			style.backgroundImage = `url('${background.values.url}')`;
			style.backgroundPosition = background.values.position;
			style.filter = `brightness(${background.values.brightness ?? 100}%) blur(${background.values.blur ?? 0}px)`;
			return (<ActualBackground
					image={background.values.url}
					color={background.values.color ?? "#336699"}
					position={background.values.position}
					brightness={background.values.brightness}
					blur={background.values.blur} />);
		case BackgroundMode.Unsplash:
			return (<UnsplashBackground {...props} />);
		}
	}

	return (<div id="background" style={style} />);
}
