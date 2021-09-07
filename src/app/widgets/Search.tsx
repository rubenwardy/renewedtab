import Panel from "app/components/Panel";
import { usePromise } from "app/hooks";
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
		defaultMessage: "Search box to your favourite search engine",
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


function Search(widget: WidgetProps<SearchProps>) {
	const props = widget.props;
	const intl = useIntl();

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

		const placeholder = name
			? intl.formatMessage(messages.searchWith, { name: name })
			: intl.formatMessage(messages.search);

		return (
			<Panel {...widget.theme} flush={true}>
				<form onSubmit={onSubmit}>
					<input autoFocus={true} placeholder={placeholder}
							type="text" name="q" ref={ref}
							className="large invisible" />
				</form>
			</Panel>);
	}

	return (
		<Panel {...widget.theme} flush={true}>
			<form method="get" action={props.searchURL}>
				<input autoFocus={true} type="text" name="q"
						placeholder={
							intl.formatMessage(messages.searchWith, { name: props.searchTitle })}
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
		searchURL: "https://google.com/search",
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

};
export default widget;
