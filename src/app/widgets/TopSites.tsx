import ErrorView from 'app/components/ErrorView';
import LinkBox, { Link } from 'app/components/LinkBox';
import RequestPermission from 'app/components/RequestPermission';
import { usePromise } from 'app/hooks/promises';
import useForceUpdate from 'app/hooks/useForceUpdate';
import { miscMessages, schemaMessages } from 'app/locale/common';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { defaultLinksThemeSchema, ListBoxStyle, WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';


function createDebugData(): browser.topSites.MostVisitedURL[] {
	const debugData = [
		{
			title: "GitLab",
			url: "https://gitlab.com",
		},
		{
			title: "GitHub",
			url: "https://github.com",
		},
		{
			title: "Minetest",
			url: "https://www.minetest.net",
		},
		{
			title: "Youtube",
			url: "https://youtube.com",
		},
		{
			title: "Google",
			url: "https://google.com",
		},
		{
			title: "TopSites Test",
			url: "https://en.wikipedia.org",
		},
	];

	return [ ...debugData ];
}


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
		defaultMessage: "Grant permission to access top sites and fetch icons from websites",
		description: "Top Sites widget: permission request",
	},
});


async function getTopSites(): Promise<browser.topSites.MostVisitedURL[]> {
	if (app_version.is_debug && (browser as any).is_ui_test == undefined) {
		return createDebugData();
	} else {
		return await browser.topSites.get();
	}
}


function TopSitesImpl(props: WidgetProps<any>) {
	const data = props.props;

	const [sites, error] = usePromise(getTopSites, []);
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
		<LinkBox {...data} widgetTheme={props.theme} links={links} useWebsiteIcons={true}
			defaultIcon="fa-globe-europe" errorIcon="fa-globe-europe"
			limitItemsToAvoidScrolling={props.theme.listBoxStyle == ListBoxStyle.Icons} />);
}

function TopSites(props: WidgetProps<Record<string, never>>) {
	const forceUpdate = useForceUpdate();
	const intl = useIntl();

	if (typeof browser.topSites === "undefined") {
		const permissions: browser.permissions.Permissions = {
			permissions: ["topSites"],
			origins: ["<all_urls>"],
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


const widget: WidgetType<Record<string, never>> = {
	Component: TopSites,
	title: messages.title,
	description: messages.description,
	editHint: miscMessages.globalSearchEditHint,
	isBrowserOnly: true,
	defaultSize: new Vector2(15, 2),

	initialProps: {},
	schema: {
		openInNewTab: type.boolean(schemaMessages.openInNewTab),
	},

	initialTheme: {
		showPanelBG: false,
		listBoxStyle: ListBoxStyle.Icons,
	},
	themeSchema: defaultLinksThemeSchema,

	async onLoaded(widget) {
		if (typeof widget.props.useIconBar !== "undefined") {
			widget.theme.listBoxStyle = widget.props.useIconBar
				? ListBoxStyle.Icons
				: ListBoxStyle.Vertical;
			widget.theme.showPanelBG = !widget.props.useIconBar;
			delete widget.props.useIconBar;
		}

		if (typeof (widget.theme as any).useIconBar !== "undefined") {
			widget.theme.listBoxStyle = (widget.theme as any).useIconBar
				? ListBoxStyle.Icons
				: ListBoxStyle.Vertical;
			delete (widget.theme as any).useIconBar;
		}
	},
};
export default widget;
