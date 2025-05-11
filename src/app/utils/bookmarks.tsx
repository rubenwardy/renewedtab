import { Link } from "app/components/LinkBox";
import { miscMessages } from "app/locale/common";
import UserError from "./UserError";

function createDebugData() {
	const retval: browser.bookmarks.BookmarkTreeNode = {
		id: "1",
		title: "Bookmarks Bar",
		children: [
			{
				id: "1",
				title: "One one one",
				url: "https://example.org",
			},
			{
				id: "2",
				title: "Two two two",
				url: "https://example.org",
			},
			{
				id: "3",
				title: "Three three three",
				children: [
					{
						id: "3-1",
						title: "Child One",
						url: "https://example.org",
					},
					{
						id: "3-2",
						title: "Child Two",
						url: "https://example.org",
					},
					{
						id: "3-3",
						title: "Child Three",
						url: "https://example.org",
					},
				],
			},
		]
	};

	for (let i = 4; i <= 9; i++) {
		retval.children!.push({
			id: i.toFixed(0),
			title: i.toFixed().repeat(10),
			url: "https://example.org",
		});
	}

	return retval;
}


async function tryGetSubTree(id: string): Promise<browser.bookmarks.BookmarkTreeNode | null> {
	if (app_version.is_debug && (browser as any).is_ui_test == undefined) {
		return createDebugData();
	}

	try {
		const toolbar_subtree = await browser.bookmarks.getSubTree(id);
		if (!toolbar_subtree || !toolbar_subtree[0]) {
			return null;
		}
		return toolbar_subtree[0]
	} catch {
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
