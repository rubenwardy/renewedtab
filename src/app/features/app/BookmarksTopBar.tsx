import { usePromise, useForceUpdate } from "app/hooks";
import { miscMessages } from "app/locale/common";
import { getBookmarks } from "app/utils/bookmarks";
import { ListBoxStyle, WidgetTheme } from "app/Widget";
import React, { useCallback } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import Button, { ButtonVariant } from "app/components/Button";
import ErrorView from "app/components/ErrorView";
import LinkBox from "app/components/LinkBox";
import RequestPermission from "app/components/RequestPermission";
import useIsLocked from "app/hooks/useIsLocked";

const messages = defineMessages({
	onHide: {
		defaultMessage: "To show the bookmarks bar again, use the option in settings",
		description: "Alert box when hiding the bookmarks toolbar"
	}
});

function BookmarksImpl(props: { widgetTheme: WidgetTheme }) {
	const [links, error] = usePromise(() => getBookmarks(false), []);
	if (!links) {
		return (<ErrorView error={error} />);
	}

	return (
		<LinkBox {...props} links={links} useWebsiteIcons={true}
			defaultIcon="fa-globe-europe" errorIcon="fa-globe-europe" />);
}


export default function BookmarksTopBar({onHide}: { onHide: () => void }) {
	const forceUpdate = useForceUpdate();
	const intl = useIntl();
	const isLocked = useIsLocked();
	const handleHide = useCallback(() => {
		alert(intl.formatMessage(messages.onHide));
		onHide();
	}, [intl, onHide]);

	if (typeof browser.bookmarks === "undefined") {
		const permissions: browser.permissions.Permissions = {
			permissions: ["bookmarks"],
			origins: ["<all_urls>"],
		};

		return (
			<aside className="bookmarks-top-bar panel flush">
				<div className="panel-inset p-3">
					<span className="mr-4">
						<FormattedMessage
							{...miscMessages.bookmarksBar} />
					</span>

					<RequestPermission permissions={permissions}
							label={intl.formatMessage(miscMessages.bookmarksPermissionLabel)}
							onResult={forceUpdate} />
				</div>

				<Button variant={ButtonVariant.Outline} onClick={handleHide}
					label={miscMessages.hideBookmarksBar} small={true}
					className="m-0" />
			</aside>);
	}
	return (
		<aside className="bookmarks-top-bar panel flush">
			<BookmarksImpl widgetTheme={{
				showPanelBG: false, listBoxStyle: ListBoxStyle.Horizontal }}  />
			{!isLocked && (
				<Button variant={ButtonVariant.Outline} onClick={handleHide}
					label={miscMessages.hideBookmarksBar} small={true} className="m-0"  />)}
		</aside>);
}
