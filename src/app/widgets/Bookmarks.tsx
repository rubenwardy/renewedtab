import ErrorView from 'app/components/ErrorView';
import LinkBox, { Link } from 'app/components/LinkBox';
import RequestPermission from 'app/components/RequestPermission';
import { useForceUpdate, usePromise } from 'app/hooks';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { defaultLinksThemeSchema, ListBoxStyle, Widget, WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { miscMessages, schemaMessages } from 'app/locale/common';
import { getBookmarks } from "app/utils/bookmarks";


const messages = defineMessages({
	title: {
		defaultMessage: "Bookmarks",
		description: "Bookmarks Widget",
	},

	description: {
		defaultMessage: "Shows your bookmarks",
		description: "Bookmarks widget description",
	},

	permissionLabel: {
		defaultMessage: "Grant permission to access bookmarks",
	},

	includeFolders: {
		defaultMessage: "Include folders as sections",
		description: "Bookmarks widget: form field label",
	},
});

interface BookmarksProps {
	includeFolders: boolean;
	openInNewTab: boolean;
}


function BookmarksImpl(widget: WidgetProps<BookmarksProps>) {
	const props = widget.props;

	const [sites, error] = usePromise(() => getBookmarks(props.includeFolders), []);
	if (!sites) {
		return (<ErrorView error={error} />);
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

function Bookmarks(widget: WidgetProps<BookmarksProps>) {
	const forceUpdate = useForceUpdate();
	const intl = useIntl();

	if (typeof browser.bookmarks === "undefined") {
		const permissions: browser.permissions.Permissions = {
			permissions: ["bookmarks"],
			origins: ["*://*/"],
		};

		return (
			<div className="panel text-muted">
				<RequestPermission permissions={permissions}
						label={intl.formatMessage(messages.permissionLabel)}
						onResult={forceUpdate} />
			</div>);
	}

	return (<BookmarksImpl {...widget} />);
}


const widget: WidgetType<BookmarksProps> = {
	Component: Bookmarks,

	title: messages.title,
	description: messages.description,
	editHint: miscMessages.globalSearchEditHint,

	isBrowserOnly: true,

	defaultSize: new Vector2(15, 2),
	initialProps: {
		includeFolders: false,
		openInNewTab: false,
	},
	schema: {
		includeFolders: type.boolean(messages.includeFolders),
		openInNewTab: type.boolean(schemaMessages.openInNewTab),
	},
	initialTheme: {
		showPanelBG: false,
		listBoxStyle: ListBoxStyle.Icons,
	},
	themeSchema: defaultLinksThemeSchema,

	async onLoaded(widget: Widget<any>) {
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
	}
};
export default widget;
