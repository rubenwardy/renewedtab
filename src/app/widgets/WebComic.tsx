import React from 'react';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { AutocompleteItem, type } from 'app/utils/Schema';
import { WidgetProps } from 'app/Widget';
import { defineMessages } from 'react-intl';
import { schemaMessages } from 'app/locale/common';
import Panel from 'app/components/Panel';
import { getAPI, useFeed } from 'app/hooks/http';
import ErrorView from 'app/components/ErrorView';
import UserError from 'app/utils/UserError';


const messages = defineMessages({
	title: {
		defaultMessage: "Web Comic",
		description: "Web Comic Widget",
	},

	description: {
		defaultMessage: "Shows the most recent image from an Atom or RSS feed, useful for WebComics.",
		description: "Web Comic widget description",
	},

	noImages: {
		defaultMessage: "No images found on feed",
		description: "Web Comic widget: no images found error",
	}
});

interface WebComicProps {
	url: string;
}

export default function WebComic(widget: WidgetProps<WebComicProps>) {
	const props = widget.props;
	const [feed, error] = useFeed(props.url, [props.url]);

	if (!feed) {
		return (<ErrorView error={error} loading={true} />);
	}

	const article = feed.articles[0];
	if (article?.image == undefined) {
		return (<ErrorView error={new UserError(messages.noImages)} />);
	}

	const title = article.title;
	return (
		<Panel {...widget.theme} className="image-caption" invisClassName="image-caption text-shadow">
			<a href={article.link} title={article.alt ?? ""}>
				<img src={article.image} alt={article.alt ?? ""} />
			</a>
			<h2><a href={article.link}>{title}</a></h2>
		</Panel>);
}


WebComic.title = messages.title;
WebComic.description = messages.description;

WebComic.initialProps = {
	url: "https://xkcd.com/atom.xml"
};

WebComic.schema = {
	url: type.urlFeed(schemaMessages.url, schemaMessages.rssUrlHint,
			() => getAPI<AutocompleteItem[]>("webcomics/", {})),
} as Schema<WebComicProps>;

WebComic.defaultSize = new Vector2(5, 4);
