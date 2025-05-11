import ErrorView from "app/components/ErrorView";
import Panel from "app/components/Panel";
import { usePromise } from "app/hooks/promises";
import { useGlobalSearch } from "app/hooks/globalSearch";
import { schemaMessages } from "app/locale/common";
import { getProbableURL } from "app/utils";
import { type } from "app/utils/Schema";
import UserError from "app/utils/UserError";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetType } from "app/Widget";
import React, { useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";


const messages = defineMessages({
	title: {
		defaultMessage: "Search",
		description: "Search Widget",
	},

	description: {
		defaultMessage: "Search widgets or the web using your favourite search engine",
		description: "Search widget description",
	},

	searchTitle: {
		defaultMessage: "Search engine name",
		description: "Search widget: form field label",
	},

	useBrowserDefault: {
		defaultMessage: "Use browser's default search engine",
		description: "Search widget: form field label",
	},

	searchWith: {
		defaultMessage: "Search with {name}",
		description: "Search widget: searchbox placeholder text, when search engine name is known",
	},

	search: {
		defaultMessage: "Search",
		description: "Search widget: searchbox placeholder text, when search engine name is unknown",
	},

	enableGlobalSearch: {
		defaultMessage: "Enable widget search",
		description: "Search widget: form field label, enable filtering widgets",
	},

	missingQueryVariable: {
		defaultMessage: "Missing '{query}' in search URL. Eg: https://google.com/search/?q='{query}'",
		description: "Search widget: error, missing query variable",
	},
});


interface SearchProps {
	useBrowserEngine: boolean;
	searchTitle: string;
	searchURL: string;
	enableGlobalSearch: boolean;
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


interface SearchEngineSettings {
	name: string;
	onSearch: (query: string) => void;
}


async function getSearchEngineSettings(props: SearchProps): Promise<SearchEngineSettings> {
	if (hasSearchAPI && props.useBrowserEngine) {
		const name = await getBrowserSearchEngineName();
		return {
			name,
			onSearch: (query) => {
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
			},
		};
	} else if (props.searchURL != "") {
		if (!props.searchURL.includes("{query}")) {
			throw new UserError(messages.missingQueryVariable);
		}

		return {
			name: props.searchTitle,
			onSearch: (query) => {
				const encoded = encodeURIComponent(query);
				window.location.href = props.searchURL.replace("{query}", encoded);
			},
		};
	} else {
		return {
			name: "",
			onSearch: () => {},
		};
	}
}


function Search(props: WidgetProps<SearchProps>) {
	const globalSearch = useGlobalSearch();
	const data = props.props;
	const intl = useIntl();
	const enableGlobalSearch = data.enableGlobalSearch ?? true;
	const [query, setQuery] = enableGlobalSearch
		// eslint-disable-next-line react-hooks/rules-of-hooks
		? [globalSearch.query, globalSearch.setQuery] : useState("");
	const directURL = getProbableURL(query);

	const [settings, error] = usePromise(() => getSearchEngineSettings(data), []);
	const ref = useRef<HTMLInputElement>(null);
	if (!settings) {
		return (<ErrorView error={error} loading={true} />);
	}

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (directURL) {
			window.location.href = directURL;
		} else if (query) {
			settings?.onSearch(query);
		}
	}

	const placeholder = settings.name
		? intl.formatMessage(messages.searchWith, { name: settings.name })
		: intl.formatMessage(messages.search);

	return (
		<Panel {...props.theme} flush={true}>
			<form onSubmit={onSubmit}>
				<span key={directURL ?? "icon"} className="icon">
					<i className={directURL !== null
						? "fas fa-globe-europe"
						: "fas fa-search"} />
				</span>
				<input ref={ref} type="search" name="q" autoComplete="off"
						autoFocus={true} placeholder={placeholder}
						value={query} onChange={e => setQuery(e.target.value)}
						className="large invisible" />
			</form>
		</Panel>);
}


const widget: WidgetType<SearchProps> = {
	Component: Search,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(15, 1),
	initialProps: {
		useBrowserEngine: true,
		searchTitle: "Google",
		searchURL: "https://google.com/search?q={query}",
		enableGlobalSearch: true,
	},

	async schema(widget) {
		if (!hasSearchAPI) {
			return {
				searchTitle: type.string(messages.searchTitle),
				searchURL: type.url(schemaMessages.url),
				enableGlobalSearch: type.boolean(messages.enableGlobalSearch),
			};
		} else if (widget.props.useBrowserEngine) {
			return {
				useBrowserEngine: type.boolean(messages.useBrowserDefault),
				enableGlobalSearch: type.boolean(messages.enableGlobalSearch),
			};
		} else {
			return {
				useBrowserEngine: type.boolean(messages.useBrowserDefault),
				searchTitle: type.string(messages.searchTitle),
				searchURL: type.url(schemaMessages.url),
				enableGlobalSearch: type.boolean(messages.enableGlobalSearch),
			};
		}
	},

	async onLoaded(widget) {
		if (widget.props.enableGlobalSearch == undefined) {
			widget.props.enableGlobalSearch = true;

			if (!widget.props.searchURL.includes("{query}")) {
				try {
					const url = new URL(widget.props.searchURL);
					url.searchParams.set("q", "---query---");
					widget.props.searchURL = url.toString().replace("q=---query---", "q={query}");
				} catch {
					widget.props.searchURL += "?q={query}";
				}
			}
		}
	},
};
export default widget;
