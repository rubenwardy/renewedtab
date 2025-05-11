import ErrorView from 'app/components/ErrorView';
import LinkBox from 'app/components/LinkBox';
import RequestPermission from 'app/components/RequestPermission';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { defaultLinksThemeSchema, ListBoxStyle, Widget, WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { miscMessages, schemaMessages } from 'app/locale/common';
import { getBookmarks } from "app/utils/bookmarks";
import useForceUpdate from 'app/hooks/useForceUpdate';
import { usePromise } from 'app/hooks/promises';


const messages = defineMessages({
	title: {
		defaultMessage: "Bookmarks",
		description: "Bookmarks Widget",
	},

	description: {
		defaultMessage: "Shows your bookmarks",
		description: "Bookmarks widget description",
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


function BookmarksImpl(props: WidgetProps<BookmarksProps>) {
	const data = props.props;

	const [links, error] = usePromise(() => getBookmarks(data.includeFolders), []);
	if (!links) {
		return (<ErrorView error={error} />);
	}

	return (
		<LinkBox {...data} widgetTheme={props.theme}  useWebsiteIcons={true}
			links={links.filter(x => !x.children)}
			defaultIcon="fa-globe-europe" errorIcon="fa-globe-europe" />);
}

function Bookmarks(props: WidgetProps<BookmarksProps>) {
	const forceUpdate = useForceUpdate();
	const intl = useIntl();

	if (typeof browser.bookmarks === "undefined") {
		const permissions: browser.permissions.Permissions = {
			permissions: ["bookmarks"],
			origins: ["<all_urls>"],
		};

		return (
			<div className="panel text-muted">
				<RequestPermission permissions={permissions}
						label={intl.formatMessage(miscMessages.bookmarksPermissionLabel)}
						onResult={forceUpdate} />
			</div>);
	}

	return (<BookmarksImpl {...props} />);
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
