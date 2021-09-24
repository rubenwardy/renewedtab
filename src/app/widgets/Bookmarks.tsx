import ErrorView from 'app/components/ErrorView';
import LinkBox, { Link } from 'app/components/LinkBox';
import RequestPermission from 'app/components/RequestPermission';
import { useForceUpdate, usePromise } from 'app/hooks';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { defaultLinksThemeSchema, Widget, WidgetProps, WidgetType } from 'app/Widget';
import UserError from 'app/utils/UserError';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { miscMessages, schemaMessages } from 'app/locale/common';


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

	errFetchBookmarks: {
		defaultMessage: "Unable to get bookmarks",
		description: "Bookmarks widget: error message",
	},
});

interface BookmarksProps {
	includeFolders: boolean;
	openInNewTab: boolean;
}

async function tryGetSubTree(id: string): Promise<browser.bookmarks.BookmarkTreeNode | null> {
	try {
		const toolbar_subtree = await browser.bookmarks.getSubTree(id);
		if (!toolbar_subtree || !toolbar_subtree[0]) {
			return null;
		}
		return toolbar_subtree[0]
	} catch (ex: any) {
		return null;
	}
}

async function getBookmarks(includeFolders: boolean): Promise<Link[]> {
	const ret: Link[] = [];

	function addAllChildren(children: browser.bookmarks.BookmarkTreeNode[]) {
		children.filter(child => child.url && child.type != "separator").forEach(child => {
			ret.push({
				id: child.id,
				title: child.title,
				icon: "",
				url: child.url!,
			});
		});
	}

	const bookmarks = await tryGetSubTree("1") ?? await tryGetSubTree("toolbar_____");
	if (!bookmarks) {
		throw new UserError(messages.errFetchBookmarks);
	}

	addAllChildren(bookmarks.children!);

	if (includeFolders) {
		bookmarks.children!
			.filter(child => child.children)
			.forEach(folder => {
				ret.push({
					id: folder.id,
					title: folder.title,
					icon: "",
					url: "",
				});

				addAllChildren(folder.children!);
			});
	}

	return ret;
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
		useIconBar: true,
	},
	themeSchema: defaultLinksThemeSchema,

	async onLoaded(widget: Widget<any>) {
		if (typeof widget.props.useIconBar !== "undefined") {
			widget.theme.useIconBar = widget.props.useIconBar;
			widget.theme.showPanelBG = !widget.props.useIconBar;
			delete widget.props.useIconBar;
		}
	}
};
export default widget;
