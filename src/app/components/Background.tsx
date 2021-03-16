import { BackgroundConfig, BackgroundMode } from "app/hooks/background";
import { useAPI } from "app/hooks";
import React, { CSSProperties } from "react";


interface BackgroundInfo {
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


interface CreditProps {
	info: BackgroundInfo;
	setIsHovered?: (value: boolean) => void;
}

function Credits(props: CreditProps) {
	const setIsHovered = props.setIsHovered ?? (() => {});

	if (props.info.links.author || props.info.links.site) {
		const title = (props.info.title && props.info.title.length > 0)
				? props.info.title : "Photo";
		return (
			<div className="credits text-shadow-soft"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}>
				<a className="title" href={props.info.links.photo}>{title}</a>
				<a href={props.info.links.author}>{props.info.author}</a>
				&nbsp;/&nbsp;
				<a href={props.info.links.site}>{props.info.site}</a>
			</div>);
	} else {
		return (
			<div className="credits text-shadow-soft"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}>
				<a href={props.info.links.photo}>
					<span className="title">{props.info.title}</span>
					<span>
						{props.info.author} / {props.info.site}
					</span>
				</a>
			</div>);
	}
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


function UnsplashBackground(props: BackgroundProps) {
	const style: CSSProperties = {};

	const collection = props.background?.values.collection;
	if (collection == undefined) {
		console.error("Collection not defined");
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
