import { usePromise } from "app/hooks";
import Schema, { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetRaw } from "app/WidgetManager";
import React from "react";


interface SearchProps {
	useBrowserEngine: boolean;
	searchTitle: string;
	searchURL: string;
}


declare namespace browser.search {
	interface SearchEngine {
		name: string;
		isDefault: boolean;
		alias?: string;
		favIconUrl?: string;
	}

	function get(): Promise<SearchEngine[]>;
}


const searchUrlByName: { [key: string]: string } = {
	google: "https://google.com/search",
	duckduckgo: "https://duckduckgo.com",
	bing: "https://www.bing.com/search",
	yahoo: "https://yahoo.com/search",
};

const hasSearchAPI = typeof browser !== "undefined" &&
	typeof browser.search !== "undefined" &&
	typeof browser.search.get !== "undefined";


async function getDefaultSearchEngine(): Promise<SearchProps> {
	const def = (await browser.search.get()).find((x) => x.isDefault);
	if (def && searchUrlByName[def.name.toLowerCase()]) {
		return {
			useBrowserEngine: false,
			searchTitle: def.name,
			searchURL: searchUrlByName[def.name.toLowerCase()],
		};
	}

	return {
		useBrowserEngine: false,
		searchTitle: "Google",
		searchURL: "https://google.com/search",
	};
}


export default function Search(props: SearchProps) {
	let engine = props;
	if (hasSearchAPI && props.useBrowserEngine) {
		const [def, error] = usePromise(() => getDefaultSearchEngine(), []);
		engine = def ?? props;
		if (!engine) {
			return (
				<div className="panel text-muted">
					{error ? error.toString() : "Loading flights..."}
				</div>);
		}
	}

	return (
		<div className="panel flush">
			<form method="get" action={engine.searchURL}>
				<input autoFocus={true} type="text" name="q"
						placeholder={`Search with ${engine.searchTitle}`}
						className="large invisible" />
			</form>
		</div>);
}


Search.description = "Search box to your favourite search engine";

Search.initialProps = {
	useBrowserEngine: true,
	searchTitle: "Google",
	searchURL: "https://google.com/search",
};

if (hasSearchAPI) {
	Search.schema = {
		useBrowserEngine: type.boolean("Use browser engine"),
		searchTitle: type.string("Search engine name"),
		searchURL: type.url("URL"),
	} as Schema;
} else {
	Search.schema = {
		searchTitle: type.string("Search engine name"),
		searchURL: type.url("URL"),
	} as Schema;
}

Search.defaultSize = new Vector2(15, 1);

Search.onCreated = (widget: WidgetRaw<SearchProps>) => {
	if (!hasSearchAPI) {
		widget.props.searchTitle = "Google";
		widget.props.searchURL = "https://google.com/search";
	}
}
