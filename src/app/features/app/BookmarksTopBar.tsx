import { usePromise, useForceUpdate } from "app/hooks";
import { miscMessages } from "app/locale/common";
import { getBookmarks } from "app/utils/bookmarks";
import { ListBoxStyle, WidgetTheme } from "app/Widget";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Button, { ButtonVariant } from "app/components/Button";
import ErrorView from "app/components/ErrorView";
import LinkBox from "app/components/LinkBox";
import RequestPermission from "app/components/RequestPermission";


function BookmarksImpl(props: { widgetTheme: WidgetTheme }) {
	const [links, error] = usePromise(() => getBookmarks(false), []);
	if (!links) {
		return (<ErrorView error={error} />);
	}

	return (
		<LinkBox {...props} links={links} useWebsiteIcons={true}
			defaultIcon="fa-globe-europe" errorIcon="fa-globe-europe" />);
}


export default function BookmarksTopBar(props: { onHide: () => void }) {
	const forceUpdate = useForceUpdate();
	const intl = useIntl();

	if (typeof browser.bookmarks === "undefined") {
		const permissions: browser.permissions.Permissions = {
			permissions: ["bookmarks"],
			origins: ["<all_urls>"],
		};

		return (
			<aside className="bookmarks-top-bar">
				<div className="panel">
					<span className="mr-4">
						<FormattedMessage
							{...miscMessages.bookmarksBar} />
					</span>

					<RequestPermission permissions={permissions}
							label={intl.formatMessage(miscMessages.bookmarksPermissionLabel)}
							onResult={forceUpdate} />

					<Button variant={ButtonVariant.Outline} onClick={props.onHide}
						label={miscMessages.hideBookmarksBar} small={true}
						className="ml-5" />
				</div>
			</aside>);
	}

	return (
		<aside className="bookmarks-top-bar">
			<BookmarksImpl widgetTheme={{
				showPanelBG: true, listBoxStyle: ListBoxStyle.Horizontal }}  />
		</aside>);
}
