import React, { useMemo } from 'react';
import { mergeClasses, parseURL } from 'app/utils';
import { getWebsiteIconOrNull } from 'app/WebsiteIcon';
import Icon from './Icon';


interface Option {
	id: string;
	title: string;
	url?: string;
}

interface TabsProps {
	value: string;
	onChanged: (v: string) => void;
	options: Option[];
	useWebsiteIcons?: boolean;
	useRootPathForIcons?: boolean;
}


function Tab(props: { option: Option, selected: boolean, useRootPathForIcons: boolean, onClick: () => void, useWebsiteIcons: boolean}) {
	const url = parseURL(props.option.url ?? "");
	if (url && props.useRootPathForIcons) {
		url.pathname = "/";
	}
	const iconPromise = useMemo(
		() => (props.useWebsiteIcons && url) ? getWebsiteIconOrNull(url.toString()) : "",
		[url, props.useWebsiteIcons]);

	return (
		<button className={mergeClasses("tab", props.selected && "selected")}
				onClick={() => props.onClick()}>
			{props.useWebsiteIcons && <Icon icon={iconPromise} />}
			{props.option.title}
		</button>);
}


export function Tabs(props: TabsProps) {
	return (
		<ul className="tabs">
			{props.options.map(option => (
				<li key={option.id}>
					<Tab option={option} selected={props.value == option.id}
						onClick={() => props.onChanged(option.id)}
						useWebsiteIcons={props.useWebsiteIcons ?? false}
						useRootPathForIcons={props.useRootPathForIcons ?? false} />
				</li>
			))}
		</ul>);
}
