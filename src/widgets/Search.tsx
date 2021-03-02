import React from "react";
import { Widget } from "./Widget";

interface SearchProps {
	searchEngine: string;
}

export function Search(props: SearchProps) {
	return (
		<Widget type="Search" props={props} className="panel flush">
			<form method="get" action={props.searchEngine}>
				<input autoFocus={true} type="text" name="q" placeholder="Search on DuckDuckGo" className="large invisible" />
			</form>
		</Widget>);
}
