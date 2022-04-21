import { Link } from "app/components/LinkBox";
import { miscMessages } from "app/locale/common";
import UserError from "./UserError";


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


function convertToLinks(bookmark: browser.bookmarks.BookmarkTreeNode): Link {
	if (bookmark.type == "separator") {
		return {
			id: bookmark.id,
			title: "",
			icon: "",
			url: "",
		};
	}

	return {
		id: bookmark.id,
		title: bookmark.title,
		icon: bookmark.children ? "fa-folder" : "",
		url: bookmark.url ?? "",
		children: bookmark.children?.map(x => convertToLinks(x))
			?? undefined,
	};
}


export async function getBookmarks(includeFoldersAsSections: boolean): Promise<Link[]> {
	const bookmarks = await tryGetSubTree("1") ?? await tryGetSubTree("toolbar_____");
	if (!bookmarks) {
		throw new UserError(miscMessages.errFetchBookmarks);
	}

	const ret = convertToLinks(bookmarks).children!;
	if (!includeFoldersAsSections) {
		return ret;
	}

	return ret.flatMap(link => {
		if (!link.children) {
			return [ link ];
		}

		return [
			{
				id: link.id,
				title: link.title,
				icon: "",
				url: "",
			},
			...link.children,
		];
	});
}
