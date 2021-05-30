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
	icon?: string;
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
	icon: string;
	requiresIcons: boolean;
	defaultIcon?: string;
	errorIcon?: string;
}


function Icon(props: IconProps) {
	const [errored, setErrored] = useState(false);

	if (!props.requiresIcons && props.icon.length == 0) {
		return null;
	} else if (errored) {
		console.log("Error icon");
		return (<span><i className={`fas ${props.errorIcon ?? "fa-times"} icon`} /></span>);
	} else if (props.icon.includes("/")) {
		console.log("URL icon");
		return (<img className="icon" src={props.icon} onError={() => setErrored(true)} />);
	} else if (props.icon.startsWith("fa-")) {
		console.log("FA icon");
		return (<span><i className={`fas ${props.icon} icon`} /></span>);
	} else {
		console.log("Placeholder icon");
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


function getAllIcons(sites: Link[]): Promise<(string | undefined)[]> {
	return Promise.all(sites.map((site) => getWebsiteIconOrNull(site.url)));
}


export default function LinkBox(props: LinkBoxProps)  {
	const useIconBar = props.widgetTheme.useIconBar ?? false;

	const links = useMemo<Link[]>(() => deepCopy(props.links), [props.links]);
	if (props.useWebsiteIcons == true && typeof browser !== "undefined") {
		const sites = useMemo(
			() => links.filter(link => link.url.length > 0 && link.icon == ""), [links]);
		const [icons] = usePromise(() => getAllIcons(sites ?? []), [links]);
		if (icons) {
			icons.forEach((icon, i) => {
				if (icon) {
					sites[i].icon = icon;
				}
			});
		}
	}

	const linkElements = links.map(link => {
		const requiresIcons = useIconBar && link.url.trim() != "";
		const icon = link.icon && (
			<Icon icon={link.icon} requiresIcons={requiresIcons}
				defaultIcon={props.defaultIcon} errorIcon={props.errorIcon} />);

		if (link.url.trim() != "") {
			return (
				<li key={link.id}>
					<a href={link.url}>
						{icon}
						<span className="title">{link.title}</span>
					</a>
				</li>);
		} else {
			return (
				<li key={link.id} className="section">
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
