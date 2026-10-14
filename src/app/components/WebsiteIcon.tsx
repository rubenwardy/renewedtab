import { useWebsiteIconURL, WEBSITE_ICON_FALLBACK } from "app/utils/websiteIcons";
import React from "react";
import Icon, { IconProps } from './Icon';

interface WebsiteIconProps extends Partial<IconProps> {
	url: (string | URL | undefined);
}

export default function WebsiteIcon(props: WebsiteIconProps) {
	const icon = useWebsiteIconURL(props.url?.toString());
	if (!icon) {
		return null;
	}

	return (<Icon errorIcon={WEBSITE_ICON_FALLBACK} {...props} icon={icon} />);
}
