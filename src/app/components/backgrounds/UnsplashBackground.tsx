import { useAPI } from "app/hooks";
import React, { CSSProperties } from "react";
import { BackgroundInfo, BackgroundProps } from ".";
import { Credits } from "./Credits";

export default function UnsplashBackground(props: BackgroundProps) {
	const style: CSSProperties = {};

	const collection = props.background?.values.collection;
	if (collection == undefined) {
		console.warn("Collection ID is undefined");
		return (<div id="background" style={style} />);
	}

	const [info, error] = useAPI<BackgroundInfo>("unsplash/",
			{ collection: collection }, []);
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
