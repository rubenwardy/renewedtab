import { usePromise } from "app/hooks";
import Schema, { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { Widget } from "app/Widget";
import React, { useRef } from "react";


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
	function search(props: any): void;
	function query(props: any): void;
}

declare namespace browser.tabs {
	interface Tab {
		id?: number;
	}

	function getCurrent(): Promise<Tab>;
}


const hasSearchAPI = typeof browser !== "undefined" && typeof browser.search !== "undefined";

const hasSearchGetAPI = hasSearchAPI && typeof browser.search.get !== "undefined";


async function getBrowserSearchEngineName(): Promise<string> {
	if (!hasSearchGetAPI) {
		return "";
	}

	const def = (await browser.search.get()).find((x) => x.isDefault);
	return def?.name ?? "";
}


export default function Search(props: SearchProps) {
	if (hasSearchAPI && props.useBrowserEngine) {
		const [name] = usePromise(() => getBrowserSearchEngineName(), []);
		const ref = useRef<HTMLInputElement>(null);

		function onSubmit(e: React.FormEvent<HTMLFormElement>) {
			e.preventDefault();

			const query = ref.current?.value;
			if (query) {
				if (typeof browser.search.query == "function") {
					browser.search.query({
						text: query
					});
				} else {
					browser.tabs.getCurrent().then((tab) => {
						browser.search.search({
							query: query,
							tabId: tab.id,
						});
					})
				}
			}
		}

		return (
			<div className="panel flush">
				<form onSubmit={onSubmit}>
					<input autoFocus={true} type="text" name="q" ref={ref}
							placeholder={name ? `Search with ${name}` : "Search"}
							className="large invisible" />
				</form>
			</div>);
	}

	return (
		<div className="panel flush">
			<form method="get" action={props.searchURL}>
				<input autoFocus={true} type="text" name="q"
						placeholder={`Search with ${props.searchTitle}`}
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

Search.schema = (widget: Widget<SearchProps>) => {
	if (!hasSearchAPI) {
		return {
			searchTitle: type.string("Search engine name"),
			searchURL: type.url("URL"),
		} as Schema;
	} else if (widget.props.useBrowserEngine) {
		return {
			useBrowserEngine: type.boolean("Use browser's default search engine"),
		}
	} else {
		return {
			useBrowserEngine: type.boolean("Use browser's default search engine"),
			searchTitle: type.string("Search engine name"),
			searchURL: type.url("URL"),
		} as Schema;
	}
}


Search.defaultSize = new Vector2(15, 1);

Search.onCreated = (widget: Widget<SearchProps>) => {
	if (!hasSearchAPI) {
		widget.props.searchTitle = "Google";
		widget.props.searchURL = "https://google.com/search";
	}
}
