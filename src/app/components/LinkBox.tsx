import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useElementSize } from 'app/hooks';
import deepCopy from 'app/utils/deepcopy';
import { getWebsiteIconOrNull } from 'app/WebsiteIcon';
import { miscMessages, schemaMessages } from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { WidgetTheme } from 'app/Widget';
import Panel from './Panel';
import Icon from './Icon';
import { useGlobalSearch } from 'app/hooks/globalSearch';
import { queryMatchesAny } from 'app/utils';


const messages = defineMessages({
	iconHint: {
		defaultMessage: "Optional, URL to image (18px recommended)",
		description: "Links widget, form field hint (Icon)",
	},

	urlHint: {
		defaultMessage: "Leave blank to make heading",
		description: "Links widget, form field hint (Link URL)",
	},
});


export interface Link {
	id: string; //< used by React for keys.
	title: string;
	icon?: string | Promise<string | undefined>;
	url: string;
}


export const LinkSchema: Schema<Link> = {
	title: type.string(schemaMessages.title),
	url: type.url(schemaMessages.url, messages.urlHint),
};


export const FullLinkSchema: Schema<Link> = {
	title: type.string(schemaMessages.title),
	icon: type.url(schemaMessages.icon, messages.iconHint),
	url: type.url(schemaMessages.url, messages.urlHint),
};


export interface LinkBoxProps {
	links: Link[];
	useWebsiteIcons?: boolean;
	defaultIcon?: string;
	errorIcon?: string;
	enableCustomIcons?: boolean;
	limitItemsToAvoidScrolling?: boolean;
	openInNewTab?: boolean;
}


export default function LinkBox(props: LinkBoxProps & { widgetTheme: WidgetTheme })  {
	const { query } = useGlobalSearch();
	const useIconBar = props.widgetTheme.useIconBar ?? false;
	const useWebsiteIcons = props.useWebsiteIcons ?? false;
	const [ref, size] = useElementSize();
	const target = props.openInNewTab ? "_blank" : undefined;

	const links = useMemo<Link[]>(() => {
		const ret = deepCopy(props.links.filter(link =>
			queryMatchesAny(query, link.title, link.url)));
		if (size && props.limitItemsToAvoidScrolling) {
			const rows = Math.max(1, Math.floor((size.y + 10) / 120));
			const columns = Math.floor((size.x + 10) / 105);
			ret.splice(rows * columns);
		}
		return ret;
	}, [props.links, size, query]);

	if (useWebsiteIcons && typeof browser !== "undefined") {
		links
			.filter(link => link.url.length > 0 && (link.icon == "" || link.icon == undefined))
			.forEach(link => {
				link.icon = getWebsiteIconOrNull(link.url);
			});
	}

	const linkElements = links.map(link => {
		const requiresIcons = (useIconBar || useWebsiteIcons) && link.url.trim() != "";
		const icon = link.icon && (
			<Icon icon={link.icon} requiresIcons={requiresIcons}
				defaultIcon={props.defaultIcon} errorIcon={props.errorIcon} />);

		if (link.url.trim() != "") {
			const domain = new URL(link.url).hostname;
			return (
				<li key={link.id} data-hostname={domain} data-url={link.url}
						data-title={link.title} data-icon={link.icon}>
					<a href={link.url} target={target}>
						{icon}
						<span className="title">{link.title}</span>
					</a>
				</li>);
		} else {
			return (
				<li key={link.id} className="section"
						data-title={link.title} data-icon={link.icon}>
					{icon}
					<span className="title">{link.title}</span>
				</li>);
		}
	});

	return (
		<Panel {...props.widgetTheme} flush={true}>
			<ul className={useIconBar ? "iconbar" : "links large"} ref={ref}>
				{linkElements}
				{linkElements.length == 0 && props.links.length > 0 && (
					<li className="section">
						<FormattedMessage {...miscMessages.noResults} />
					</li>)}
			</ul>
		</Panel>);
}
