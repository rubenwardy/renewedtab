import { getWebsiteIconOrNull } from "app/websiteIcons";
import React, { useMemo } from "react";
import Icon, { IconProps } from './Icon';

interface WebsiteIconProps extends Partial<IconProps> {
	url: (string | URL | undefined);
}

export default function WebsiteIcon(props: WebsiteIconProps) {
	const iconPromise = useMemo(
		() => (props.url) ? getWebsiteIconOrNull(props.url.toString()) : "",
		[props.url]);

	return (<Icon {...props} icon={iconPromise} />);
}
