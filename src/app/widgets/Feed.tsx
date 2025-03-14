import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { AutocompleteItem, type } from 'app/utils/Schema';
import { WidgetEditComponentProps, WidgetProps, WidgetType } from 'app/Widget';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { miscMessages, schemaMessages } from 'app/locale/common';
import Panel from 'app/components/Panel';
import { fetchAPI, useMultiFeed, useForceUpdateValue } from 'app/hooks';
import ErrorView from 'app/components/ErrorView';
import uuid from 'app/utils/uuid';
import { TabOption, Tabs } from 'app/components/Tabs';
import UserError from 'app/utils/UserError';
import { useGlobalSearch } from 'app/hooks/globalSearch';
import { parseURL, queryMatchesAny } from 'app/utils';
import { Article } from 'common/feeds/parse';
import WebsiteIcon from 'app/components/WebsiteIcon';
import { myFormatMessage } from "app/locale/MyMessageDescriptor";
import Button, { ButtonVariant } from "app/components/Button";
import { makeOPML, parseOPML } from "common/feeds/opml";
import { FeedSource } from "common/feeds";


const messages = defineMessages({
	title: {
		defaultMessage: "Feed",
		description: "Feed Widget",
	},

	description: {
		defaultMessage: "Shows Atom, JSONFeed, and RSS feeds - useful for following the news, websites, and blogs",
		description: "Feed widget description",
	},

	titleHint: {
		defaultMessage: "Leave blank to use feed's title",
		description: "Feed widget: form field hint (Title)",
	},

	sources: {
		defaultMessage: "Sources",
		description: "Feed widget: form field label",
	},

	combineSources: {
		defaultMessage: "Combine sources into single tab",
		description: "Feed widget: form field label",
	},

	showImages: {
		defaultMessage: "Show images",
		description: "Feed widget: form field label",
	},

	showImagesHint: {
		defaultMessage: "Experimental. This does not work with all feed sources, due to missing image information. Images may also be large, and take a while to load.",
		description: "Feed widget: form field hint (Show Images)",
	},

	filters: {
		defaultMessage: "Filter Articles",
		description: "Feed widget: form field label",
	},

	filtersHint: {
		defaultMessage: "An article will be shown if it matches at least one 'Show' filter (if any), and no 'Hide' filters.",
		description: "Feed widget: form field hint (Filters)",
	},

	isAllowed: {
		defaultMessage: "Show / Hide",
		description: "Feed widget filter allow label",
	},

	show: {
		defaultMessage: "Show",
		description: "Feed widget: filter allow checkbox label",
	},

	hide: {
		defaultMessage: "Hide",
		description: "Feed widget: filter show checkbox label",
	},

	noSources: {
		defaultMessage: "Please specify a source",
		description: "Feed widget: no sources error message",
	},
});


interface Filter {
	id: string; //< required for React
	isAllowed: (boolean | string);
	text: string;
}

interface FeedProps {
	sources: FeedSource[];
	combineSources: boolean;
	filters: Filter[];
	openInNewTab: boolean;
	useWebsiteIcons: boolean;
	showImages: boolean;
}


interface FeedPanelProps extends FeedProps {
	onGotTitle: (source: FeedSource, title: (string | undefined), htmlUrl: (string | undefined)) => void;
}


function FeedArticle({ article, data }: { article: Article, data: FeedProps }) {
	if (data.showImages) {
		return (
			<div className="row row-gap-3">
				<div className="col-3">
					<div className="ratio ratio-4x3">
						{article.image
							? (<img className="thumbnail" loading="lazy" src={article.image} />)
							: (<div className="thumbnail" />)}
					</div>
				</div>
				<div className="col">
					{article.title}
					{data.sources.length != 1 && (
						<p className="mt-1 mb-0 text-muted">
							{article.feed.source?.title || article.feed.title}
						</p>)}
				</div>
			</div>);
	} else if (data.sources.length == 1) {
		return (<>{article.title}</>);
	} else if (data.useWebsiteIcons) {
		return (
			<div className="row row-gap-3">
				<div className="col-auto">
					<WebsiteIcon url={article.feed.source!.url} title={article.feed.source?.title} className="m-0" />
				</div>
				<div className="col">
					{article.title}
					<p className="mt-1 mb-0 text-muted">
						{article.feed.source?.title || article.feed.title}
					</p>
				</div>
			</div>);
	} else {
		return (
			<>
				{article.title}
				<p className="mt-1 mb-0 text-muted">
					{article.feed.source?.title || article.feed.title}
				</p>
			</>);
	}
}


/* eslint-disable react-hooks/rules-of-hooks */
function FeedPanel(props: FeedPanelProps) {
	const [info, error] = useMultiFeed(props.sources, [props.sources.length]);
	const { query } = useGlobalSearch();
	const target = props.openInNewTab ? "_blank" : undefined;
	const intl = useIntl();

	if (!info) {
		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => { }, [""]);
		return (
			<div className="panel-inset">
				<ErrorView error={error} loading={true} panel={false} />
			</div>);
	}

	const [feed, errors] = info;

	useEffect(() => {
		const seen: any = {};

		(feed?.articles ?? []).map(x => x.feed).forEach(subfeed => {
			if (subfeed.source && !seen[subfeed.source.id]) {
				seen[subfeed.source.id] = true;
				props.onGotTitle(subfeed.source, subfeed.title, subfeed.link);
			}
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feed]);

	const allowFilters = props.filters
		.filter(filter => filter.isAllowed === true || filter.isAllowed == "true")
		.map(filter => filter.text.toLowerCase());

	const blockFilters = props.filters
		.filter(filter => !(filter.isAllowed === true || filter.isAllowed == "true"))
		.map(filter => filter.text.toLowerCase());

	const seenIds = new Set();
	const rows = feed.articles
		.filter(article => queryMatchesAny(query, article.title))
		.filter(article => {
			if (seenIds.has(article.id)) {
				return false;
			}
			seenIds.add(article.id);
			return true;
		})
		.filter(article => {
			const title = article.title.toLowerCase();
			return article.link &&
				(allowFilters.length == 0 ||
					allowFilters.some(filter => title.includes(filter))) &&
				!blockFilters.some(filter => title.includes(filter));
		})
		.map(article => (
			<li key={article.id}>
				<a href={article.link} target={target} rel="noreferrer">
					<FeedArticle article={article} data={props} />
				</a>
			</li>));

	return (
		<ul className="links">
			{errors.map(({ source, error }, i) => (
				<li key={`err-${i}`} className="section error">
					<FormattedMessage
						defaultMessage="Failed to load {source}: {error}"
						description="Feed error message"
						values={{
							source: source.title ?? source.url,
							error: error.messageDescriptor ? myFormatMessage(intl, error.messageDescriptor) : error.message,
						}} />
				</li>
			))}
			{rows}
			{rows.length == 0 && feed.articles.length > 0 && (
				<li className="section">
					<FormattedMessage {...miscMessages.noResults} />
				</li>
			)}
		</ul>);
}


function Feed(props: WidgetProps<FeedProps>) {
	const data = props.props;
	const showAll = props.props.combineSources;
	const showTabs = !showAll;

	const [selectedId, setSelectedId] = useState(showAll ? "*" : (data.sources[0]?.id ?? ""));
	const selectedSource = data.sources.find(x => x.id == selectedId);
	const sources: FeedSource[] = selectedId == "*" ? data.sources : (selectedSource ? [selectedSource] : []);
	const [force, forceUpdate] = useForceUpdateValue();

	const options = useMemo<TabOption[]>(() => {
		const ret: TabOption[] = data.sources.filter(x => x.url).map(x => ({
			id: x.id,
			title: x.title || parseURL(x.url)?.hostname || "?",
			url: x.url,
			link: x.htmlUrl,
		}));
		if (showAll) {
			ret.unshift({
				id: "*",
				title: "All",
				url: "",
			});
		}

		return ret;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [force, data.sources, data.sources.length]);

	if (data.sources.length == 0) {
		return (
			<ErrorView error={new UserError(messages.noSources)} />);
	}

	return (
		<Panel {...props.theme} flush={true}>
			{showTabs && (
				<Tabs value={selectedId} options={options} onChanged={setSelectedId}
					useWebsiteIcons={data.useWebsiteIcons}
					useRootPathForIcons={true} />)}
			<FeedPanel {...data}
				key={sources.map(x => x.url).join(",")}
				sources={sources}
				onGotTitle={(source, title, htmlUrl) => {
					if (title && !source.title) {
						source.title = title;
					}
					if (htmlUrl && !source.htmlUrl) {
						source.htmlUrl = htmlUrl;
					}
					props.save();
					forceUpdate();
				}} />
		</Panel>);
}


function encode(str: string) {
	// Escapes needed to fix `#` in data.
	return btoa(unescape(encodeURIComponent(str)));
}


function FeedsImportExport(props: WidgetEditComponentProps<FeedProps>) {
	const handleImport = useCallback(async (file: File) => {
		const text = new TextDecoder("utf-8").decode(await file.arrayBuffer());
		const sources = parseOPML(text, (s, l) => new window.DOMParser().parseFromString(s, l as any));

		// Avoid duplicates
		const urls = new Set();
		props.props.sources.forEach(x => urls.add(x.url));

		props.props.sources = [
			...props.props.sources,
			...sources.filter(x => !urls.has(x.url))
		];
		props.onChange();
	}, [props]);

	const exportData = useMemo(() => {
		const feeds = makeOPML(props.props.sources);
		return `data:text/plain;base64,${encode(feeds ?? "")}`
	}, [props.props.sources]);

	const ref = useRef<HTMLInputElement>(null);
	return (
		<div className="buttons row-centered mb-4">
			<p className="col my-0 text-muted">
				<FormattedMessage {...miscMessages.globalSearchEditHint} />
			</p>
			<input ref={ref} type="file" className="display-none"
				accept=".opml,application/xml" name="import-file"
				onChange={(e) => handleImport(e.target.files![0]).catch(console.error)} />
			<Button id="import"
				variant={ButtonVariant.Secondary}
				onClick={() => ref.current?.click()}
				label={miscMessages.import} />
			<Button id="export" data-cy="export-opml"
				variant={ButtonVariant.Secondary}
				href={exportData}
				download="renewedtab-feeds.opml"
				label={miscMessages.export} />
		</div>);
}


const filterSchema: Schema<Filter> = {
	isAllowed: type.select({ false: "Hide", true: "Allow" },
		{ false: messages.hide, true: messages.show }, messages.isAllowed),
	text: type.string(schemaMessages.text),
};


const sourceSchema: Schema<FeedSource> = {
	title: type.string(schemaMessages.title, messages.titleHint),
	url: type.urlFeed(schemaMessages.url, schemaMessages.rssUrlHint,
		() => fetchAPI<AutocompleteItem[]>("feeds/", {})),
};


const widget: WidgetType<FeedProps> = {
	Component: Feed,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 4),
	editHeaderComponent: FeedsImportExport,
	initialProps: {
		sources: [
			{
				id: uuid(),
				title: "BBC News",
				url: "https://feeds.bbci.co.uk/news/rss.xml",
			},
			{
				id: uuid(),
				title: "The Register",
				url: "https://www.theregister.com/headlines.atom",
			},
		],
		combineSources: false,
		filters: [],
		openInNewTab: false,
		useWebsiteIcons: false,
		showImages: false,
	},

	async schema() {
		if (typeof browser !== "undefined") {
			return {
				sources: type.array(sourceSchema, messages.sources),
				filters: type.unorderedArray(filterSchema, messages.filters, messages.filtersHint),
				combineSources: type.boolean(messages.combineSources),
				openInNewTab: type.boolean(schemaMessages.openInNewTab),
				useWebsiteIcons: type.booleanHostPerm(schemaMessages.useWebsiteIcons),
				showImages: type.boolean(messages.showImages, messages.showImagesHint),
			};
		} else {
			return {
				sources: type.array(sourceSchema, messages.sources),
				filters: type.unorderedArray(filterSchema, messages.filters, messages.filtersHint),
				combineSources: type.boolean(messages.combineSources),
				openInNewTab: type.boolean(schemaMessages.openInNewTab),
				showImages: type.boolean(messages.showImages, messages.showImagesHint),
			};
		}
	},

	async onLoaded(widget) {
		widget.props.filters = widget.props.filters ?? [];
		if ((widget.props as any).url) {
			widget.props.sources = [
				{
					id: uuid(),
					title: (widget.props as any).title ?? "",
					url: (widget.props as any).url,
				}
			];
			delete (widget.props as any).title;
			delete (widget.props as any).url;
		}
	},
};
export default widget;
