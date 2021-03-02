import React from "react";
import { Widget } from "./Widget";

interface SearchProps {
	searchTitle: string;
	searchURL: string;
}

export function Search(props: SearchProps) {
	return (
		<Widget type="Search" props={props} className="panel flush">
			<form method="get" action={props.searchURL}>
				<input autoFocus={true} type="text" name="q" placeholder={`Search on ${props.searchTitle}`} className="large invisible" />
			</form>
		</Widget>);
}
