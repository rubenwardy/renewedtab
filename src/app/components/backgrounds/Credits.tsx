import { useDelay } from "app/hooks/delay";
import { BackgroundInfo } from "common/api/backgrounds";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import Button, { ButtonVariant } from "../Button";


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
			<div className="credits text-shadow"
					onMouseEnter={startOnHover}
					onMouseLeave={onMouseLeave}>
				<a className="title" href={props.info.links.photo}>{title}</a>
				<a href={props.info.links.author}>{props.info.author}</a>
				&nbsp;/&nbsp;
				<a href={props.info.links.site} className="mr-2">{props.info.site}</a>

				{props.onLike &&
					<Button onClick={() => props.onLike!(props.info)}
							variant={ButtonVariant.None} small={true}
							active={props.isPositive === true}
							title={intl.formatMessage(messages.like)}
							icon="fas fa-thumbs-up" />}

				{props.onBlock &&
					<Button onClick={() => props.onBlock!(props.info)}
							variant={ButtonVariant.None} small={true}
							active={props.isPositive === false}
							title={intl.formatMessage(messages.block)}
							icon="fas fa-ban"  />}
			</div>);
	} else {
		return (
			<div className="credits text-shadow"
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
