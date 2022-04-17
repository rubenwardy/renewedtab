import { usePromise, useForceUpdate } from "app/hooks";
import { getBookmarks } from "app/utils/bookmarks";
import { ListBoxStyle, WidgetTheme } from "app/Widget";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import Button, { ButtonVariant } from "./Button";
import ErrorView from "./ErrorView";
import LinkBox, { Link } from "./LinkBox";
import RequestPermission from "./RequestPermission";

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

	hideBookmarksBar: {
		defaultMessage: "Hide",
		description: "Hide"
	}
});


interface BookmarksProps {
	includeFolders: boolean;
	openInNewTab: boolean;
	widgetTheme: WidgetTheme;
}


function BookmarksImpl(props: BookmarksProps) {
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
		<LinkBox {...props} links={links} useWebsiteIcons={true}
			defaultIcon="fa-globe-europe" errorIcon="fa-globe-europe" />);
}


export default function BookmarksTopBar(props: { onHide: () => void }) {
	const forceUpdate = useForceUpdate();
	const intl = useIntl();

	if (typeof browser.bookmarks === "undefined") {
		const permissions: browser.permissions.Permissions = {
			permissions: ["bookmarks"],
			origins: ["*://*/"],
		};

		return (
			<aside className="bookmarks-top-bar">
				<div className="panel text-muted">
					<RequestPermission permissions={permissions}
							label={intl.formatMessage(messages.permissionLabel)}
							onResult={forceUpdate} />
					<Button variant={ButtonVariant.Outline} onClick={props.onHide}
						label={messages.hideBookmarksBar} small={true}
						className="ml-5" />
				</div>
			</aside>);
	}

	return (
		<aside className="bookmarks-top-bar">
			<BookmarksImpl includeFolders={false} openInNewTab={false}
				widgetTheme={{ showPanelBG: true, listBoxStyle: ListBoxStyle.Horizontal }}  />
		</aside>);
}
