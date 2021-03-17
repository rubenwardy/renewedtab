import { useAPI, useStorage } from "app/hooks";
import React, { CSSProperties } from "react";
import { Credits } from "./Credits";
import { BackgroundInfo, BackgroundProps } from ".";


function reportVote(info: BackgroundInfo, isPositive: boolean) {
	const url = new URL(config.API_URL);
	url.pathname = (url.pathname + "background/vote/").replaceAll("//", "/");

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


function useAutoBackground(blocked: Set<string>): [(BackgroundInfo | undefined), (any | undefined)] {
	const [backgrounds, error] = useAPI<BackgroundInfo[]>("background/", {}, []);

	if (backgrounds && backgrounds.length > 0) {
		for (let i = 0; i < backgrounds.length; i++) {
			if (!blocked.has(backgrounds[i].id)) {
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

	const [blocked, setBlocked] = useStorage<string[]>("blocked_backgrounds");
	const blockedSet = new Set(blocked ?? []);

	const [liked, setLiked] = useStorage<string[]>("liked_backgrounds");
	const likedSet = new Set(liked ?? []);

	const [background, error] = useAutoBackground(blockedSet);
	if (background) {
		function handleBlock(info: BackgroundInfo) {
			reportVote(info, false);
			blockedSet.add(info.id);
			setBlocked(Array.from(blockedSet.values()));
		}

		function handleLike(info: BackgroundInfo) {
			reportVote(info, true);
			likedSet.add(info.id);
			setLiked(Array.from(likedSet.values()));
		}

		if (background.color) {
			style.backgroundColor = background.color;
		}
		style.backgroundImage = `url('${background.url}')`;
		return (
			<>
				<div id="background" style={style} />
				<Credits info={background} setIsHovered={props.setWidgetsHidden}
					onBlock={handleBlock} onLike={handleLike} />
			</>);
	} else {
		if (error) {
			style.backgroundColor = props.background!.values.color ?? "#336699";
		}
		return (<div id="background" style={style} />);
	}
}
