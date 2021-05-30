import { useDelay } from "app/hooks/delay";
import { BackgroundInfo } from "common/api/backgrounds";
import React from "react";
import { defineMessages, useIntl } from "react-intl";


const messages = defineMessages({
	like: {
		defaultMessage: "Like",
		description: "Background credits vote",
	},

	block: {
		defaultMessage: "Never show again",
		description: "Background credits vote",
	},
});


interface CreditProps {
	info: BackgroundInfo;
	setIsHovered?: (value: boolean) => void;

	isPositive?: boolean;
	onLike?: (info: BackgroundInfo) => void;
	onBlock?: (info: BackgroundInfo) => void;
}

export function Credits(props: CreditProps) {
	const setIsHovered = props.setIsHovered ?? (() => {});
	const [startOnHover, cancelOnHover] = useDelay(setIsHovered, 200, true);

	function onMouseLeave() {
		cancelOnHover();
		setIsHovered(false);
	}

	const intl = useIntl();

	if (props.info.links.author || props.info.links.site) {
		const title = (props.info.title && props.info.title.length > 0)
				? props.info.title : "Photo";
		return (
			<div className="credits text-shadow-soft"
					onMouseEnter={startOnHover}
					onMouseLeave={onMouseLeave}>
				<a className="title" href={props.info.links.photo}>{title}</a>
				<a href={props.info.links.author}>{props.info.author}</a>
				&nbsp;/&nbsp;
				<a href={props.info.links.site} className="mr-2">{props.info.site}</a>

				{props.onLike &&
					<a onClick={() => props.onLike!(props.info)}
							className={`btn btn-sm ${props.isPositive === true && "active"}`}
							title={intl.formatMessage(messages.like)}>
						<i className="fas fa-thumbs-up" />
					</a>}

				{props.onBlock &&
					<a onClick={() => props.onBlock!(props.info)}
							className={`btn btn-sm ${props.isPositive === false && "active"}`}
							title={intl.formatMessage(messages.block)}>
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
