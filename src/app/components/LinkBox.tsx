import React, { useMemo, useRef } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useElementSize } from 'app/hooks/elementSize';
import deepCopy from 'app/utils/deepcopy';
import { getWebsiteIconOrNull } from 'app/websiteIcons';
import { miscMessages, schemaMessages } from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { ListBoxStyle, WidgetTheme } from 'app/Widget';
import Panel from './Panel';
import Icon from './Icon';
import { useGlobalSearch } from 'app/hooks/globalSearch';
import { mergeClasses, parseURL, queryMatchesAny } from 'app/utils';
import { enumToValue } from "app/utils/enum";


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

	children?: Link[];
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


function LinkLists(props: LinkBoxProps & { widgetTheme: WidgetTheme }) {
	const listBoxStyle = enumToValue(ListBoxStyle, props.widgetTheme.listBoxStyle ?? ListBoxStyle.Vertical);
	const useWebsiteIcons = props.useWebsiteIcons ?? false;
	const showText = listBoxStyle == ListBoxStyle.Vertical || (props.widgetTheme.showText ?? true);
	const target = props.openInNewTab ? "_blank" : undefined;

	const ret = props.links.map(link => {
		const requiresIcons = (listBoxStyle == ListBoxStyle.Icons || useWebsiteIcons) && link.url.trim() != "";
		const icon = link.icon && (
			<Icon icon={link.icon} requiresIcons={requiresIcons}
				defaultIcon={props.defaultIcon} errorIcon={props.errorIcon} />);

		if (link.url.trim() != "") {
			const attr = (typeof browser !== "undefined" && link.url.startsWith("chrome://")) ? {
				onClick: () => browser.tabs.update(undefined, { url: link.url }),
			} : { href: link.url };

			return (
				<li key={link.id} data-hostname={parseURL(link.url)?.hostname} data-url={link.url}
					data-title={link.title} data-icon={link.icon}>
					<a {...attr} target={target} rel="noreferrer">
						{icon}
						{showText && (
							<span className="title">{link.title}</span>)}
					</a>
				</li>);
		} else if (link.children) {
			return (
				<li key={link.id} data-title={link.title} data-icon={link.icon}>
					<a>
						{icon}
						<span className="title">{link.title}</span>
					</a>
					{link.children && (
						<div className="dropdown">
							<ul className="links links-align">
								<LinkLists {...props} links={link.children} />
							</ul>
						</div>)}
				</li>);
		} else if (link.title != "") {
			return (
				<li key={link.id} className="section"
					data-title={link.title} data-icon={link.icon}>
					{icon}
					<span className="title">{link.title}</span>
				</li>);
		} else {
			return (<li key={link.id} className="separator" />);
		}
	});

	return (<>{ret}</>);
}


export default function LinkBox(props: LinkBoxProps & { widgetTheme: WidgetTheme }) {
	const { query } = useGlobalSearch();
	const listBoxStyle = enumToValue(ListBoxStyle, props.widgetTheme.listBoxStyle ?? ListBoxStyle.Vertical);
	const useWebsiteIcons = props.useWebsiteIcons ?? false;
	const ref = useRef<HTMLDivElement>(null);
	const size = useElementSize(ref);

	const links = useMemo<Link[]>(() => {
		const ret = deepCopy(props.links.filter(link =>
			queryMatchesAny(query, link.title, link.url)));
		if (size && props.limitItemsToAvoidScrolling) {
			const rows = Math.max(1, Math.floor((size.y + 10) / 120));
			const columns = Math.floor((size.x + 10) / 105);
			ret.splice(rows * columns);
		}
		return ret;
	}, [props.links, props.limitItemsToAvoidScrolling, size, query]);

	if (useWebsiteIcons && typeof browser !== "undefined") {
		links
			.filter(link => link.url.length > 0 && (link.icon == "" || link.icon == undefined))
			.forEach(link => {
				link.icon = getWebsiteIconOrNull(link.url);
			});
	}


	const ulClasses = mergeClasses(
		listBoxStyle == ListBoxStyle.Icons && "iconbar",
		listBoxStyle == ListBoxStyle.Vertical && "links large",
		listBoxStyle == ListBoxStyle.Horizontal && "links links-align links-horizontal",
	);

	return (
		<Panel {...props.widgetTheme} flush={true} ref={ref}>
			<ul className={ulClasses}>
				<LinkLists {...props} links={links} />
				{links.length == 0 && props.links.length > 0 && (
					<li className="section">
						<FormattedMessage {...miscMessages.noResults} />
					</li>)}
			</ul>
		</Panel>);
}
