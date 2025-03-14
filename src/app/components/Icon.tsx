import React, { useState } from 'react';
import { usePromise } from 'app/hooks';
import { mergeClasses } from 'app/utils';


export interface IconProps {
	icon: string | Promise<string | undefined>;
	requiresIcons?: boolean;
	defaultIcon?: string;
	errorIcon?: string;
	className?: string;
	title?: string;
}


export default function Icon(props: IconProps) {
	const [errored, setErrored] = useState(false);
	const requiresIcons = props.requiresIcons ?? true;

	const [icon,] = usePromise(async () => {
		if (props.icon instanceof Promise) {
			return await props.icon;
		} else {
			return props.icon;
		}
	}, [props.icon]);

	if (!requiresIcons && (!icon || icon.length == 0)) {
		return null;
	} else if (errored) {
		return (<span title={props.title} className={props.className}><i className={`fas ${props.errorIcon ?? "fa-times"} icon`} /></span>);
	} else if (typeof icon == "string" && (icon.includes("/") || icon.startsWith("data:"))) {
		return (<img title={props.title} className={mergeClasses("icon", props.className)} src={icon} onError={() => setErrored(true)} />);
	} else if (typeof icon == "string" && icon.startsWith("fa-")) {
		return (<span title={props.title} className={props.className}><i className={`fas ${icon} icon`} /></span>);
	} else {
		return (<span title={props.title} className={props.className}><i className={`fas ${props.defaultIcon ?? "fa-circle"} icon`} /></span>);
	}
}
