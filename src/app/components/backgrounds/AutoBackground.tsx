import { useAPI, useStorage } from "app/hooks";
import React from "react";
import { BackgroundProps } from ".";
import { BackgroundInfo } from "common/api/backgrounds";
import ActualBackground from "./ActualBackground";


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


function useAutoBackground(votes: { [id: string]: boolean }): [(BackgroundInfo | undefined), (any | undefined)] {
	const [backgrounds, error] = useAPI<BackgroundInfo[]>("background/", {}, []);

	if (backgrounds && backgrounds.length > 0) {
		for (let i = 0; i < backgrounds.length; i++) {
			if (votes[backgrounds[i].id] !== false) {
				return [backgrounds[i], undefined];
			}
		}

		return [backgrounds[0], undefined];
	} else {
		return [undefined, error];
	}
}


export default function AutoBackground(props: BackgroundProps) {
	const [votes_, setVotes] = useStorage<{ [id: string]: boolean }>("background_votes");
	const votes = votes_ ?? {};
	const values = props.background!.values;

	const [background] = useAutoBackground(votes);
	if (!background) {
		return (
			<ActualBackground color={values.colour  ?? "#336699"}  />
		);
	}

	function handleBlock(info: BackgroundInfo) {
		reportVote(info, false);
		votes[info.id] = false;
		setVotes(votes);
	}

	function handleLike(info: BackgroundInfo) {
		reportVote(info, true);
		votes[info.id] = true;
		setVotes(votes);
	}

	const credits = {
		info: background,
		setIsHovered: props.setWidgetsHidden,
		onBlock: handleBlock,
		onLike: handleLike,
		isPositive: votes[background.id]
	}

	return (
		<ActualBackground {...values}
			color={background.color} image={background.url} credits={credits} />
	)
}
