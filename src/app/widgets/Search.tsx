import { Vector2 } from "app/utils/Vector2";
import React from "react";

interface SearchProps {
	searchTitle: string;
	searchURL: string;
}

export default function Search(props: SearchProps) {
	return (
		<div className="panel flush">
			<form method="get" action={props.searchURL}>
				<input autoFocus={true} type="text" name="q" placeholder={`Search on ${props.searchTitle}`} className="large invisible" />
			</form>
		</div>);
}


Search.defaultProps = {
	searchTitle: "DuckDuckGo",
	searchURL: "https://duckduckgo.com"
};

Search.defaultSize = new Vector2(15, 1);
