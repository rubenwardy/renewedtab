import React, { useMemo } from 'react';
import { mergeClasses } from 'app/utils';
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
}


function Tab(props: { option: Option, selected: boolean, onClick: () => void, useWebsiteIcons: boolean}) {
    const iconPromise = useMemo(
        () => props.useWebsiteIcons ? getWebsiteIconOrNull(props.option.url ?? "") : "",
        [props.option.url, props.useWebsiteIcons]);

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
                        useWebsiteIcons={props.useWebsiteIcons ?? false} />
				</li>
			))}
		</ul>);
}
