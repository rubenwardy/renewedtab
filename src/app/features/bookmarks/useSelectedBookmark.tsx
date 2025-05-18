import { useMemo } from "react";

export interface SelectedBookmark {
	node: browser.bookmarks.BookmarkTreeNode;
	path: string[];
	crumbs: string[];
}

function findBookmark(node: browser.bookmarks.BookmarkTreeNode, id: string): SelectedBookmark | null {
	if (node.id === id) {
		return { node, path: [id], crumbs: [node.title]};
	}

	for (const child of node.children ?? []) {
		const ret = findBookmark(child, id);
		if (ret) {
			ret.path.unshift(node.id);
			ret.crumbs.unshift(node.title);
			return ret;
		}
	}

	return null;
}

export default function useSelectedBookmark(root: browser.bookmarks.BookmarkTreeNode | null, path: string[]): SelectedBookmark | null {
	return useMemo(() => {
		if (root === null) {
			return null;
		}

		if (path.length === 1) {
			return findBookmark(root, path[0]);
		}

		const crumbs: string[] = [];
		let node: browser.bookmarks.BookmarkTreeNode = root;
		const stack = [...path].reverse();
		while (stack.length > 0) {
			const next = stack.pop();
			node = node.children?.find(child => child.id == next) ?? node;
			crumbs.push(node.title);
		}

		return { node, path, crumbs };
	}, [root, path]);
}
