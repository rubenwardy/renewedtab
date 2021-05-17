import React from 'react';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';
import { useFeed } from 'app/hooks/feeds';
import { WidgetProps } from 'app/Widget';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import schemaMessages from 'app/locale/common';
import Panel from 'app/components/Panel';


const messages = defineMessages({
	description: {
		defaultMessage: "Shows the most recent page from a webcomic, using Atom or RSS",
	},

	titleHint: {
		defaultMessage: "Leave blank to use feed's title",
	},

	loading: {
		defaultMessage: "Loading feed...",
	},

	noImages: {
		defaultMessage: "No images found on feed"
	}
});

interface WebComicProps {
	url: string;
}

export default function WebComic(widget: WidgetProps<WebComicProps>) {
	const props = widget.props;
	const intl = useIntl();

	const [feed, error] = useFeed(props.url, [props.url]);

	if (!feed) {
		return (
			<div className="panel text-muted">
				{error ? error.toString() : intl.formatMessage(messages.loading)}
			</div>);
	}

	const article = feed.articles[0];
	if (article?.image == undefined) {
		return (
			<div className="panel text-muted">
				<FormattedMessage {...messages.noImages} />
			</div>);
	}

	const title = article.title;
	return (
		<Panel {...widget.theme} className="image-caption" invisClassName="image-caption text-shadow-hard">
			<a href={article.link} title={article.alt ?? ""}>
				<img src={article.image} alt={article.alt ?? ""} />
			</a>
			<h2><a href={article.link}>{title}</a></h2>
		</Panel>);
}


WebComic.description = messages.description;

WebComic.initialProps = {
	url: "https://xkcd.com/atom.xml"
};

WebComic.schema = {
	url: type.urlPerm(schemaMessages.url, schemaMessages.rssUrlHint),
} as Schema;

WebComic.defaultSize = new Vector2(5, 4);
