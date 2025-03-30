import React, { useEffect, useMemo, useRef, useState } from "react";
import { ListBoxStyle, WidgetTheme } from "app/Widget";
import Icon from "app/components/Icon";
import Panel from "app/components/Panel";
import { mergeClasses, parseURL, queryMatchesAny } from "app/utils";
import { Vector2 } from "app/utils/Vector2";
import { defineMessages } from "react-intl";
import Schema, { type } from 'app/utils/Schema';
import { schemaMessages } from "app/locale/common";
import deepCopy from "app/utils/deepcopy";
import { getWebsiteIconOrNull } from "app/websiteIcons";
import { enumToValue } from "app/utils/enum";
import useElementSize from "app/hooks/useElementSize";
import useGlobalSearch from "app/hooks/useGlobalSearch";

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
	onClick?: (link: Link) => void;
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

interface BaseLinkBoxProps {
	useWebsiteIcons?: boolean;
	defaultIcon?: string;
	errorIcon?: string;
	openInNewTab?: boolean;
	limitItemsToAvoidScrolling?: boolean;
	widgetTheme: WidgetTheme;
}

interface LinkBoxProps extends BaseLinkBoxProps {
	links: Link[];
}

export type LinkBoxWidgetProps = Omit<LinkBoxProps, "widgetTheme">;

function Dropdown(props: { links: Link[]; anchor: "right" | "bottom" | false; linkBoxProps: BaseLinkBoxProps}) {
	const { links, anchor, linkBoxProps } = props;
	const ref = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<Vector2 | undefined>(undefined);
	useEffect(() => {
		const parent = ref.current?.parentElement;
		if (parent && anchor !== false) {
			const update = () => {
				const rect = parent.getBoundingClientRect();
				if (rect) {
					if (anchor === "bottom") {
						setPosition(new Vector2(rect.left, rect.bottom));
					} else {
						setPosition(new Vector2(rect.right - 20, rect.top));
					}
				}
			};

			parent.addEventListener("mouseover", update);
			return () => parent.removeEventListener("mouseover", update);
		}
	}, [ref, setPosition, anchor]);

	return (
		<div ref={ref}
				className={mergeClasses("linkbox", anchor && "dropdown-js")}
				style={{ position: anchor ? "fixed" : "absolute", top: position?.y, left: position?.x }}>
			{links.map(link => (<LinkItem key={link.id} link={link} linkBoxProps={linkBoxProps} />))}
		</div>);
}

function LinkItem(props: { link: Link; isHorizontal?: boolean; linkBoxProps: BaseLinkBoxProps }) {
	const {link, isHorizontal, linkBoxProps} = props;
	const listBoxStyle = enumToValue(ListBoxStyle, linkBoxProps.widgetTheme.listBoxStyle ?? ListBoxStyle.Vertical);
	const useWebsiteIcons = linkBoxProps.useWebsiteIcons ?? false;
	const showText = listBoxStyle == ListBoxStyle.Vertical || (linkBoxProps.widgetTheme.showText ?? true);
	const target = linkBoxProps.openInNewTab ? "_blank" : undefined;
	const requiresIcons = (listBoxStyle == ListBoxStyle.Icons || useWebsiteIcons) && link.url.trim() != "";
	const icon = link.icon && (<Icon icon={link.icon} requiresIcons={requiresIcons}
		defaultIcon={linkBoxProps.defaultIcon} errorIcon={linkBoxProps.errorIcon} />);

	if (link.url !== "") {
		const attr = (typeof browser !== "undefined" && link.url.startsWith("chrome://")) ? {
			onClick: () => browser.tabs.update(undefined, { url: link.url }),
		} : { href: link.url };

		return (
			<a className="link-item link-item-action"
					{...attr}
					rel="noreferrer"
					target={target}
					data-hostname={parseURL(link.url)?.hostname}
					data-url={link.url}
					data-title={link.title}
					data-icon={link.icon}>
				{icon}
				{showText && (
					<span className="title">{link.title}</span>)}
			</a>);
	} else if (link.onClick) {
		return (
			<button className="link-item link-item-action"
					rel="noreferrer"
					onClick={() => link.onClick!(link)}>
				{icon}
				{showText && (
					<span className="title">{link.title}</span>)}
			</button>);
	} else if (link.children) {
		return (
			<div className="dropdown">
				<div className="link-item link-item-action">
					{icon}
					<span className="title">{link.title}</span>
				</div>
				<Dropdown
					links={link.children}
					anchor={isHorizontal ? false : "right"}
					linkBoxProps={linkBoxProps} />
			</div>);
	} else if (link.title !== "") {
		return (
			<div className="link-item section">
				{icon}
				<span className="title">{link.title}</span>
			</div>);
	} else {
		return (
			<div key={link.id} className="separator" />);
	}
}

export default function LinkBox(props: LinkBoxProps) {
	const {links: rawLinks, ...style} = props;
	const listBoxStyle = enumToValue(ListBoxStyle, props.widgetTheme.listBoxStyle ?? ListBoxStyle.Vertical);
	const useWebsiteIcons = props.useWebsiteIcons ?? false;
	const { query } = useGlobalSearch();
	const ref = useRef<HTMLDivElement>(null);
	const size = useElementSize(ref);

	const links = useMemo<Link[]>(() => {
		const ret: Link[] = deepCopy(rawLinks.filter(link =>
			queryMatchesAny(query, link.title, link.url)));
		if (size && props.limitItemsToAvoidScrolling) {
			const rows = Math.max(1, Math.floor((size.y + 10) / 120));
			const columns = Math.floor((size.x + 10) / 105);
			ret.splice(rows * columns);
		}

		if (useWebsiteIcons && typeof browser !== "undefined") {
			ret
				.filter(link => link.url.length > 0 && (link.icon == "" || link.icon == undefined))
				.forEach(link => {
					link.icon = getWebsiteIconOrNull(link.url);
				});
		}

		return ret;
	}, [rawLinks, size, props.limitItemsToAvoidScrolling, useWebsiteIcons, query]);

	const ulClasses = mergeClasses(
		listBoxStyle == ListBoxStyle.Icons && "iconbar",
		listBoxStyle == ListBoxStyle.Vertical && "linkbox large",
		listBoxStyle == ListBoxStyle.Horizontal && "linkbox links-horizontal",
	);
	const isHorizontal = listBoxStyle == ListBoxStyle.Horizontal;

	return (
		<Panel {...props.widgetTheme} scrolling={!isHorizontal} flush={true} ref={ref}>
			<nav className={ulClasses}>
				{links.map(link =>
					<LinkItem
						key={link.id}
						link={link}
						isHorizontal={isHorizontal}
						linkBoxProps={style} />)}
			</nav>
		</Panel>);
}
