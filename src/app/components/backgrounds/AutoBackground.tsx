import { useAPI, useStorage } from "app/hooks";
import React, { CSSProperties } from "react";
import { Credits } from "./Credits";
import { BackgroundInfo, BackgroundProps } from ".";


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
	const style: CSSProperties = {};

	const [votes_, setVotes] = useStorage<{ [id: string]: boolean }>("background_votes");
	const votes = votes_ ?? {};

	const [background, error] = useAutoBackground(votes);
	if (background) {
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

		if (background.color) {
			style.backgroundColor = background.color;
		}
		style.backgroundImage = `url('${background.url}')`;
		return (
			<>
				<div id="background" style={style} />
				<Credits info={background} setIsHovered={props.setWidgetsHidden}
					onBlock={handleBlock} onLike={handleLike} isPositive={votes[background.id]}  />
			</>);
	} else {
		if (error) {
			style.backgroundColor = props.background!.values.color ?? "#336699";
		}
		return (<div id="background" style={style} />);
	}
}
