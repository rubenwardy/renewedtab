import { CreditProps } from "app/backgrounds";
import { useStorage } from "app/hooks";
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


function reportVote(info: BackgroundInfo, isPositive: boolean) {
	const url = new URL(config.API_URL);
	url.pathname = (url.pathname + "background/vote/").replace(/\/\//g, "/");

	fetch(new Request(url.toString(), {
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


function CreditsVote(props: CreditProps) {
	const intl = useIntl();
	const [votes, setVotes] = useStorage<Record<string, boolean>>("background_votes", {}, false);
	const isPositive: (boolean | undefined) = votes?.[props.info.id] ?? undefined;

	function handleClick(isPositive: boolean) {
		if (votes?.[props.info.id] !== isPositive) {
			reportVote(props.info, isPositive);
		}

		setVotes({
			...votes,
			[props.info.id]: isPositive,
		});

		if (props.onVoted) {
			props.onVoted();
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


export function Credits(props: CreditProps) {
	const setIsHovered = props.setIsHovered ?? (() => {});
	const [startOnHover, cancelOnHover] = useDelay(setIsHovered, 200, true);

	function onMouseLeave() {
		cancelOnHover();
		setIsHovered(false);
	}

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

				{props.enableVoting && <CreditsVote {...props} />}
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
