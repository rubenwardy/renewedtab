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


export async function getBookmarks(includeFolders: boolean): Promise<Link[]> {
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
		throw new UserError(miscMessages.errFetchBookmarks);
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
