import ErrorView from 'app/components/ErrorView';
import LinkBox, { Link } from 'app/components/LinkBox';
import RequestPermission from 'app/components/RequestPermission';
import { useForceUpdate, usePromise } from 'app/hooks';
import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { defaultLinksThemeSchema, Widget, WidgetProps, WidgetTheme } from 'app/Widget';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Top Sites",
		description: "Top Sites Widget",
	},

	description: {
		defaultMessage: "Shows top sites",
		description: "Top Sites widget: description",
	},

	permissionLabel: {
		defaultMessage: "Grant permission to access top sites",
		description: "Top Sites widget: permission request",
	},
});

function TopSitesImpl(widget: WidgetProps<any>) {
	const props = widget.props;

	const [sites, error] = usePromise(() => browser.topSites.get(), []);
	if (!sites) {
		return (<ErrorView error={error} loading={true} />);
	}

	const links: Link[] = sites.map((site) => ({
		id: site.url,
		title: site.title,
		icon: "",
		url: site.url,
	}));

	return (
		<LinkBox {...props} widgetTheme={widget.theme} links={links} useWebsiteIcons={true}
			defaultIcon="fa-globe-europe" errorIcon="fa-globe-europe" />);
}

export default function TopSites(widget: WidgetProps<any>) {
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

	return (<TopSitesImpl {...widget} />);
}


TopSites.title = messages.title;
TopSites.description = messages.description;

TopSites.isBrowserOnly = true;

TopSites.initialProps = {};

TopSites.schema = {} as Schema;

TopSites.defaultSize = new Vector2(15, 2);

TopSites.themeSchema = defaultLinksThemeSchema;

TopSites.initialTheme = {
	showPanelBG: false,
	useIconBar: true,
} as WidgetTheme;

TopSites.onLoaded = async (widget: Widget<any>) => {
	if (typeof widget.props.useIconBar !== "undefined") {
		widget.theme.useIconBar = widget.props.useIconBar;
		widget.theme.showPanelBG = !widget.props.useIconBar;
		delete widget.props.useIconBar;
	}
}
