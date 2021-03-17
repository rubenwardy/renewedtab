import React from "react";
import { BackgroundInfo } from ".";

interface CreditProps {
	info: BackgroundInfo;
	setIsHovered?: (value: boolean) => void;
	onLike?: (info: BackgroundInfo) => void;
	onBlock?: (info: BackgroundInfo) => void;
}

export function Credits(props: CreditProps) {
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
				<a href={props.info.links.site} className="mr-2">{props.info.site}</a>

				{props.onLike &&
					<a onClick={() => props.onLike!(props.info)}
							className="btn btn-sm" title="Like">
						<i className="fas fa-thumbs-up" />
					</a>}

				{props.onBlock &&
					<a onClick={() => props.onBlock!(props.info)}
							className="btn btn-sm" title="Never show again">
						<i className="fas fa-ban" />
					</a>}
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
