import React from 'react';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';
import { Feed, useFeed } from 'app/hooks/feeds';
import { Widget, WidgetProps } from 'app/Widget';
import { defineMessages, useIntl } from 'react-intl';
import schemaMessages from 'app/locale/common';


const messages = defineMessages({
	description: {
		defaultMessage: "Shows an Atom or RSS feed",
	},

	titleHint: {
		defaultMessage: "Leave blank to use feed's title",
	},

	loading: {
		defaultMessage: "Loading feed...",
	},

	filters: {
		defaultMessage: "Filter Articles",
	},

	filtersHint: {
		defaultMessage: "An article will be shown if it matches at least one 'Allow'ed filter, and none of the other filters.",
	},

	isAllowed: {
		defaultMessage: "Allow",
	},
});

interface Filter {
	id: string; //< required for React
	isAllowed: boolean;
	text: string;
}

interface FeedProps {
	title?: string;
	url: string;
	filters: Filter[];
}

export default function Feed(widget: WidgetProps<FeedProps>) {
	const props = widget.props;

	const [feed, error] = useFeed(props.url, [props.url]);
	const intl = useIntl();

	if (!feed) {
		return (
			<div className="panel text-muted">
				{error ? error.toString() : intl.formatMessage(messages.loading)}
			</div>);
	}

	const allowFilters = props.filters
		.filter(filter => filter.isAllowed)
		.map(filter => filter.text.toLowerCase());

	const blockFilters = props.filters
		.filter(filter => !filter.isAllowed)
		.map(filter => filter.text.toLowerCase());

	const rows = feed.articles
		.filter(article => {
			const title = article.title.toLowerCase();
			return allowFilters.every(filter => title.includes(filter)) &&
					!blockFilters.some(filter => title.includes(filter));
		})
		.map(article => (
			<li key={article.link}><a href={article.link}>{article.title}</a></li>));

	const title = (props.title && props.title.length > 0)
		? props.title
		: feed.title;

	const titleContent = feed.link ? (<a href={feed.link}>{title}</a>) : title;

	return (
		<div className="panel flush">
			<h2 className="panel-inset">{titleContent}</h2>
			<ul>
				{rows}
			</ul>
		</div>);
}


Feed.description = messages.description;

Feed.initialProps = {
	title: "",
	url: "https://feeds.bbci.co.uk/news/rss.xml",
	filters: [],
};


const filterSchema: Schema = {
	isAllowed: type.boolean(messages.isAllowed),
	text: type.string(schemaMessages.text),
};

Feed.schema = {
	title: type.string(schemaMessages.title, messages.titleHint),
	url: type.urlPerm(schemaMessages.url, schemaMessages.rssUrlHint),
	filters: type.unorderedArray(filterSchema, messages.filters, messages.filtersHint),
} as Schema;

Feed.defaultSize = new Vector2(5, 4);

Feed.onLoaded = async (widget: Widget<FeedProps>) => {
	widget.props.filters = widget.props.filters ?? [];
}
