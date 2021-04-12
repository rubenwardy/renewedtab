import LinkBox, { Link } from 'app/components/LinkBox';
import RequestPermission from 'app/components/RequestPermission';
import { useForceUpdate, usePromise } from 'app/hooks';
import schemaMessages from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';


const messages = defineMessages({
	description: {
		defaultMessage: "Shows top sites",
	},

	permissionLabel: {
		defaultMessage: "Grant permission to access top sites",
	},
});

interface TopSitesProps {
	useIconBar: boolean;
}

function TopSitesImpl(props: TopSitesProps) {
	const [sites, error] = usePromise(() => browser.topSites.get(), []);
	if (!sites) {
		return (error &&
			<div className="panel text-muted">
				{error.toString()}
			</div>);
	}

	const links: Link[] = sites.map((site) => ({
		id: site.url,
		title: site.title,
		icon: "",
		url: site.url,
	}));

	return (
		<LinkBox {...props} links={links} useWebsiteIcons={true}
			defaultIcon="fa-globe-europe" errorIcon="fa-globe-europe" />);
}

export default function TopSites(widget: WidgetProps<TopSitesProps>) {
	const props = widget.props;

	const forceUpdate = useForceUpdate();
	const intl = useIntl();

	if (typeof browser.topSites === "undefined") {
		const permissions: browser.permissions.Permissions = {
			permissions: ["topSites"],
			origins: ["*://*/"],
		};

		return (
			<div className="panel text-muted">
				<RequestPermission permissions={permissions}
						label={intl.formatMessage(messages.permissionLabel)}
						onResult={forceUpdate} />
			</div>);
	}

	return (<TopSitesImpl {...props} />);
}


TopSites.description = messages.description;

TopSites.isBrowserOnly = true;

TopSites.initialProps = {
	useIconBar: true,
};

TopSites.schema = {
	useIconBar: type.boolean(schemaMessages.useIconBar),
} as Schema;

TopSites.defaultSize = new Vector2(15, 2);
