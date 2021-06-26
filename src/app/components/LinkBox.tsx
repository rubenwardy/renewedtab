import React, { useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import { usePromise } from 'app/hooks';
import deepCopy from 'app/utils/deepcopy';
import { getWebsiteIconOrNull } from 'app/WebsiteIcon';
import { schemaMessages } from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { WidgetTheme } from 'app/Widget';
import Panel from './Panel';


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


export const LinkSchema : Schema = {
	title: type.string(schemaMessages.title),
	url: type.url(schemaMessages.url, messages.urlHint),
};


export const FullLinkSchema : Schema = {
	title: type.string(schemaMessages.title),
	icon: type.url(schemaMessages.icon, messages.iconHint),
	url: type.url(schemaMessages.url, messages.urlHint),
};


interface IconProps {
	icon: string | Promise<string | undefined>;
	requiresIcons: boolean;
	defaultIcon?: string;
	errorIcon?: string;
}


function Icon(props: IconProps) {
	const [errored, setErrored] = useState(false);

	const [icon,] = usePromise(async () => {
		if (props.icon instanceof Promise) {
			return await props.icon;
		} else {
			return props.icon;
		}
	}, [props.icon])

	if (!props.requiresIcons && (!icon || icon.length == 0)) {
		return null;
	} else if (errored) {
		return (<span><i className={`fas ${props.errorIcon ?? "fa-times"} icon`} /></span>);
	} else if (icon && icon.includes("/")) {
		return (<img className="icon" src={icon} onError={() => setErrored(true)} />);
	} else if (icon && icon.startsWith("fa-")) {
		return (<span><i className={`fas ${icon} icon`} /></span>);
	} else {
		return (<span><i className={`fas ${props.defaultIcon ?? "fa-circle"} icon`} /></span>);
	}
}


export interface LinkBoxProps {
	widgetTheme: WidgetTheme;
	links: Link[];
	useWebsiteIcons?: boolean;
	defaultIcon?: string;
	errorIcon?: string;
	enableCustomIcons?: boolean;
}


export default function LinkBox(props: LinkBoxProps)  {
	const useIconBar = props.widgetTheme.useIconBar ?? false;
	const useWebsiteIcons = props.useWebsiteIcons ?? false;

	const links = useMemo<Link[]>(() => deepCopy(props.links), [props.links]);
	if (useWebsiteIcons && typeof browser !== "undefined") {
		links
			.filter(link => link.url.length > 0 && link.icon == "")
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
					<a href={link.url}>
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
			<ul className={useIconBar ? "iconbar" : "links large"}>
				{linkElements}
			</ul>
		</Panel>);
}
