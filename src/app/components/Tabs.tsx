import React from 'react';
import { mergeClasses, parseURL } from 'app/utils';
import WebsiteIcon from './WebsiteIcon';


export interface TabOption {
	id: string;
	title: string;

	// URL to get WebsiteIcon from
	url?: string;

	// Link when double clicking
	link?: string;
}

interface TabsProps {
	value: string;
	onChanged: (v: string) => void;
	options: TabOption[];
	useWebsiteIcons?: boolean;
	useRootPathForIcons?: boolean;
}


function Tab(props: { option: TabOption, selected: boolean, useRootPathForIcons: boolean, onClick: () => void, useWebsiteIcons: boolean}) {
	const url = parseURL(props.option.url ?? "");
	if (url && props.useRootPathForIcons) {
		url.pathname = "/";
	}

	return (
		<button className={mergeClasses("tab", props.selected && "selected")}
				role="tab" aria-selected={props.selected}
				onClick={() => props.onClick()} onDoubleClick={() => {
					if (props.option.link) {
						window.location.href = props.option.link;
					}
				}}>
			{props.useWebsiteIcons && <WebsiteIcon url={url} />}
			{props.option.title}
		</button>);
}


export function Tabs(props: TabsProps) {
	return (
		<ul className="tabs" role="tablist">
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
