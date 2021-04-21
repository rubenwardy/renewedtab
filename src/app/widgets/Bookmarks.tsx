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
		defaultMessage: "Shows your bookmarks",
	},

	permissionLabel: {
		defaultMessage: "Grant permission to access bookmarks",
	},

	includeFolders: {
		defaultMessage: "Include folders as sections",
	},
});

interface BookmarksProps {
	useIconBar: boolean;
	includeFolders: boolean;
}

async function tryGetSubTree(id: string): Promise<browser.bookmarks.BookmarkTreeNode | null> {
	try {
		const toolbar_subtree = await browser.bookmarks.getSubTree(id);
		if (!toolbar_subtree || !toolbar_subtree[0]) {
			return null;
		}
		return toolbar_subtree[0]
	} catch (ex) {
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
		throw new Error("Unable to get bookmarks");
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

function BookmarksImpl(props: BookmarksProps) {
	const [sites, error] = usePromise(() => getBookmarks(props.includeFolders), []);
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

export default function Bookmarks(widget: WidgetProps<BookmarksProps>) {
	const props = widget.props;

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

	return (<BookmarksImpl {...props} />);
}


Bookmarks.description = messages.description;

Bookmarks.isBrowserOnly = true;

Bookmarks.initialProps = {
	useIconBar: true,
	includeFolders: false,
};

Bookmarks.schema = {
	useIconBar: type.boolean(schemaMessages.useIconBar),
	includeFolders: type.boolean(messages.includeFolders),
} as Schema;

Bookmarks.defaultSize = new Vector2(15, 2);