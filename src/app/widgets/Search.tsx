import ErrorView from "app/components/ErrorView";
import Panel from "app/components/Panel";
import { usePromise } from "app/hooks";
import { useGlobalSearch } from "app/hooks/globalSearch";
import { schemaMessages } from "app/locale/common";
import { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetType } from "app/Widget";
import React, { useRef } from "react";
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
});


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

	function get(): Promise<SearchEngine[]>; // eslint-disable-line
	function search(props: any): void; // eslint-disable-line
	function query(props: any): void; // eslint-disable-line
}

declare namespace browser.tabs {
	interface Tab {
		id?: number;
	}

	function getCurrent(): Promise<Tab>; // eslint-disable-line
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
	} else {
		return {
			name: props.searchTitle,
			onSearch: (query) => {
				const encoded = encodeURIComponent(query);
				window.location.href = props.searchURL.replace("{query}", encoded);
			},
		}
	}
}


function Search(widget: WidgetProps<SearchProps>) {
	const { query, setQuery } = useGlobalSearch();
	const props = widget.props;
	const intl = useIntl();

	const [settings, error] = usePromise(() => getSearchEngineSettings(props), []);
	const ref = useRef<HTMLInputElement>(null);
	if (!settings) {
		return (<ErrorView error={error} loading={true} />);
	}

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const query = ref.current?.value;
		if (query) {
			settings?.onSearch(query);
		}
	}

	const placeholder = settings.name
		? intl.formatMessage(messages.searchWith, { name: settings.name })
		: intl.formatMessage(messages.search);

	return (
		<Panel {...widget.theme} flush={true}>
			<form onSubmit={onSubmit}>
				<i className="icon fas fa-search" />
				<input autoFocus={true} placeholder={placeholder}
						value={query} onChange={e => setQuery(e.target.value)}
						type="text" name="q" ref={ref}
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
	},

	onCreated(widget) {
		if (!hasSearchAPI) {
			widget.props.searchTitle = "Google";
			widget.props.searchURL = "https://google.com/search";
		}
	},

	async schema(widget) {
		if (!hasSearchAPI) {
			return {
				searchTitle: type.string(messages.searchTitle),
				searchURL: type.url(schemaMessages.url),
			};
		} else if (widget.props.useBrowserEngine) {
			return {
				useBrowserEngine: type.boolean(messages.useBrowserDefault),
			};
		} else {
			return {
				useBrowserEngine: type.boolean(messages.useBrowserDefault),
				searchTitle: type.string(messages.searchTitle),
				searchURL: type.url(schemaMessages.url),
			};
		}
	},

	async onLoaded(widget) {
		if (!widget.props.searchURL.includes("{query}")) {
			const url = new URL(widget.props.searchURL);
			url.searchParams.set("q", "---query---");
			widget.props.searchURL = url.toString().replace("q=---query---", "q={query}");
		}
	}

};
export default widget;
