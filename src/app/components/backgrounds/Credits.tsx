import { BackgroundCredit } from "app/backgrounds/common";
import { buildAPIURL, fetchCheckCors, useStorage } from "app/hooks";
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

	photo: {
		defaultMessage: "Photo",
		description: "Background credits title placeholder",
	},
});


function reportVote(info: BackgroundInfo, isPositive: boolean) {
	const url = buildAPIURL("/background/vote/");
	fetchCheckCors(new Request(url.toString(), {
		method: "POST",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			background: {
				id: info.id,
				url: info.links.photo,
			},
			is_positive: isPositive,
		}),
	})).catch(console.error);
}


export interface CreditsProps extends BackgroundCredit {
	setIsHovered?: (value: boolean) => void;
	onVoted?: (isPositive: boolean) => void;
}



function CreditsVote(props: CreditsProps) {
	const intl = useIntl();
	const [votes, setVotes] = useStorage<Record<string, boolean>>("background_votes", {}, false);
	const isPositive: (boolean | undefined) = votes?.[props.info!.id] ?? undefined;

	function handleClick(isPositive: boolean) {
		if (votes?.[props.info!.id] !== isPositive) {
			reportVote(props.info!, isPositive);
		}

		setVotes({
			...votes,
			[props.info!.id]: isPositive,
		});

		if (props.onVoted) {
			props.onVoted(isPositive);
		}
	}


	return (
		<>
			<Button onClick={() => handleClick(true)}
					variant={ButtonVariant.None} small={true}
					active={isPositive === true}
					title={intl.formatMessage(messages.like)}
					icon="fas fa-thumbs-up" />

			<Button onClick={() => handleClick(false)}
					variant={ButtonVariant.None} small={true}
					active={isPositive === false}
					title={intl.formatMessage(messages.block)}
					icon="fas fa-ban" />
		</>);
}


export function Credits(props: CreditsProps) {
	const setIsHovered = props.setIsHovered ?? (() => {});
	const [startOnHover, cancelOnHover] = useDelay(setIsHovered, 100, true);
	const intl = useIntl();

	function onMouseLeave() {
		cancelOnHover();
		setIsHovered(false);
	}


	const title = (props.title?.text && props.title.text.length > 0)
			? props.title.text : intl.formatMessage(messages.photo);

	if (props.author?.url || props.site?.url) {
		return (
			<div className="credits text-shadow"
					onMouseEnter={startOnHover}
					onMouseLeave={onMouseLeave}>
				<a className="line-2" href={props.title?.url}>{title}</a>
				<span className="line-1">
					{props.author && (<a href={props.author?.url}>{props.author?.text}</a>)}
					{props.author && props.site && (<>&nbsp;/&nbsp;</>)}
					<a href={props.site?.url} className="mr-2">{props.site?.text}</a>
				</span>

				{props.enableVoting && <CreditsVote {...props} />}
			</div>);
	} else if (props.author || props.site) {
		return (
			<div className="credits text-shadow"
					onMouseEnter={startOnHover}
					onMouseLeave={onMouseLeave}>
				<a href={props.title?.url}>
					<span className="line-2">{title}</span>
					<span className="line-1">
						{props.author && `${props.author?.text} /`}
						{props.site?.text}
					</span>
				</a>
			</div>);
	} else {
		return (
			<div className="credits text-shadow"
					onMouseEnter={startOnHover}
					onMouseLeave={onMouseLeave}>
				<a href={props.title?.url}>
					<span className="line-1 oneline">{title}</span>
				</a>
			</div>);
	}
}
