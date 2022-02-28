import React, { useEffect, useState } from 'react';
import { Vector2 } from 'app/utils/Vector2';
import { AutocompleteItem, type } from 'app/utils/Schema';
import { WidgetProps, WidgetType } from 'app/Widget';
import { defineMessages, useIntl } from 'react-intl';
import { schemaMessages } from 'app/locale/common';
import Panel from 'app/components/Panel';
import { getAPI, useFeed } from 'app/hooks/http';
import ErrorView from 'app/components/ErrorView';
import UserError from 'app/utils/UserError';
import Modal from "app/components/Modal";


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


function WebComic(widget: WidgetProps<WebComicProps>) {
	const props = widget.props;
	const [feed, error] = useFeed(props.url, [props.url]);
	const [fullscreen, setFullscreen] = useState(false);
	useEffect(() => setFullscreen(false), [feed]);

	if (!feed) {
		return (<ErrorView error={error} loading={true} />);
	}

	const article = feed.articles[0];
	if (article?.image == undefined) {
		return (<ErrorView error={new UserError(messages.noImages)} />);
	}

	const title = article.title;

	if (fullscreen) {
		return (
			<Modal title={article.title} onClose={() => setFullscreen(false)}
				wide={true} tall={true}>

				<div className="modal-body text-center">
					<a href={article.link} title={article.alt ?? ""}>
						<img src={article.image} alt={article.alt ?? ""} />
					</a>
				</div>
			</Modal>);
	} else {
		return (
			<Panel {...widget.theme} className="image-caption" invisClassName="image-caption text-shadow">
				<a onClick={() => setFullscreen(true)} title={article.alt ?? ""}>
					<img src={article.image} alt={article.alt ?? ""} />
				</a>
				<h2><a href={article.link}>{title}</a></h2>
			</Panel>);
	}
}


const widget: WidgetType<WebComicProps> = {
	Component: WebComic,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 4),
	initialProps: {
		url: "https://xkcd.com/atom.xml"
	},
	schema: {
		url: type.urlFeed(schemaMessages.url, schemaMessages.rssUrlHint,
			() => getAPI<AutocompleteItem[]>("webcomics/", {})),
	},
};
export default widget;
