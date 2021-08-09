import { useAPI } from "app/hooks";
import { BackgroundInfo } from "common/api/backgrounds";
import React from "react";
import { BackgroundProps } from ".";
import ActualBackground from "./ActualBackground";

export default function UnsplashBackground(props: BackgroundProps) {
	const values = props.background!.values;

	const collection = props.background?.values.collection;
	if (collection == undefined) {
		console.warn("Collection ID is undefined");
		return (<ActualBackground color={values.colour  ?? "#336699"} />);
	}

	const [info] = useAPI<BackgroundInfo>("unsplash/",
			{ collection: collection }, []);
	if (!info) {
		return (<ActualBackground color={values.colour  ?? "#336699"} />);
	}

	const credits = {
		info: info,
		setIsHovered: props.setWidgetsHidden
	}

	return (
		<ActualBackground color={info.color} image={info.url}
			credits={credits} brightness={values.brightness} blur={values.blur} />
	);
}
