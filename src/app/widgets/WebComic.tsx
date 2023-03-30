import React, { ReactNode, useEffect, useState } from 'react';
import { Vector2 } from 'app/utils/Vector2';
import { AutocompleteItem, type } from 'app/utils/Schema';
import { WidgetProps, WidgetType } from 'app/Widget';
import { defineMessages } from 'react-intl';
import { schemaMessages } from 'app/locale/common';
import Panel from 'app/components/Panel';
import { fetchAPI, useFeed } from 'app/hooks/http';
import ErrorView from 'app/components/ErrorView';
import UserError from 'app/utils/UserError';
import Modal from "app/components/Modal";


const messages = defineMessages({
	title: {
		defaultMessage: "Web Comic",
		description: "Web Comic Widget",
	},

	description: {
		defaultMessage: "Shows the recent images from an Atom, JSONFeed, or RSS feed - useful for WebComics.",
		description: "Web Comic widget description",
	},

	noImages: {
		defaultMessage: "No images found on feed",
		description: "Web Comic widget: no images found error",
	}
});


interface ImageCarouselProps {
	hasPrev: boolean;
	hasNext: boolean;
	onNavigate: (wasPrev: boolean) => void;

	children: ReactNode[] | ReactNode;
}


function ImageCarousel(props: ImageCarouselProps) {
	return (
		<div className="row h-100">
			<div className="col-auto">
				<button className="image-carousel-control" disabled={!props.hasPrev} onClick={() => props.onNavigate(true)}>
					<i className="fas fa-caret-left" />
				</button>
			</div>
			<div className="col panel-inset border-box h-100">
				{props.children}
			</div>
			<div className="col-auto">
				<button className="image-carousel-control" disabled={!props.hasNext} onClick={() => props.onNavigate(false)}>
					<i className="fas fa-caret-right" />
				</button>
			</div>
		</div>);
}


interface WebComicProps {
	url: string;
}


function WebComic(widget: WidgetProps<WebComicProps>) {
	const props = widget.props;
	const [feed, error] = useFeed(props.url, [props.url]);
	const [page, setPage] = useState(0);
	const [fullscreen, setFullscreen] = useState(false);
	useEffect(() => {
		setFullscreen(false);
		setPage(0);
	}, [feed]);

	if (!feed) {
		return (<ErrorView error={error} loading={true} />);
	}

	const article = feed.articles[page];
	if (article?.image == undefined) {
		return (<ErrorView error={new UserError(messages.noImages)} />);
	}

	const title = article.title;

	function handleNavigate(wasPrev: boolean) {
		if (wasPrev && page + 1 < feed!.articles.length) {
			setPage(page + 1);
		}
		if (!wasPrev && page - 1 >= 0) {
			setPage(page - 1);
		}
	}

	if (fullscreen) {
		return (
			<Modal title={article.title} onClose={() => setFullscreen(false)}
				wide={true} tall={true}>

				<div className="modal-body p-0 text-center">
					<ImageCarousel hasPrev={page + 1 < feed.articles.length} hasNext={page > 0} onNavigate={handleNavigate}>
						<a href={article.link} title={article.alt ?? ""} className="max-w-100 p-5">
							<img
								className="max-w-100 border-box m-center"
								key={article.image}
								src={article.image}
								alt={article.alt ?? ""} />
						</a>
					</ImageCarousel>
				</div>
			</Modal>);
	} else {
		return (
			<Panel {...widget.theme} flush={true} invisClassName="text-shadow">
				<ImageCarousel hasPrev={page + 1 < feed.articles.length} hasNext={page > 0} onNavigate={handleNavigate}>
					<div className="image-caption h-100">
						<a onClick={() => setFullscreen(true)} title={article.alt ?? ""}>
							<img key={article.image} src={article.image} alt={article.alt ?? ""} />
						</a>
						<h2 className="m-0">
							<a href={article.link}>{title}</a>
						</h2>
					</div>
				</ImageCarousel>
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
			() => fetchAPI<AutocompleteItem[]>("webcomics/", {})),
	},
};
export default widget;
