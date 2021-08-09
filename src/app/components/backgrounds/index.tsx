import { BackgroundConfig, BackgroundMode, getSchemaForMode } from "app/hooks/background";
import React, { useMemo } from "react";
import ActualBackground from "./ActualBackground";


export interface BackgroundProps {
	background: BackgroundConfig | null;
	setWidgetsHidden?: (value: boolean) => void;
}


import AutoBackground from "./AutoBackground";
import ImageBackground from "./ImageBackground";
import UnsplashBackground from "./UnsplashBackground";


function getFilteredBg(background: (BackgroundConfig | null)): (BackgroundConfig | null) {
	if (!background) {
		return null;
	}

	const schema = getSchemaForMode(background.mode);
	const values: any = {};
	Object.keys(schema).forEach(key => {
		values[key] = background.values[key];
	})

	return {
		mode: background.mode,
		values: values,
	};
}


export default function Background(props: BackgroundProps) {
	const background = useMemo(() => getFilteredBg(props.background), [props.background])

	if (background) {
		switch (background.mode) {
		case BackgroundMode.Auto:
			return (<AutoBackground {...props} />);
		case BackgroundMode.Color:
			return (<ActualBackground color={background.values.color ?? "#336699"} />);
		case BackgroundMode.Image:
			return (<ImageBackground {...props} />);
		case BackgroundMode.ImageUrl:
			return (<ActualBackground
					{...background.values} image={background.values.url} color="#336699" />);
		case BackgroundMode.Unsplash:
			return (<UnsplashBackground {...props} />);
		}
	}

	return (<div id="background" />);
}
