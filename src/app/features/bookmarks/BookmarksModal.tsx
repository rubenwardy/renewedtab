import React, { ReactNode, useMemo, useState } from "react";
import { BookmarksModalContext } from "./useShowBookmarksModal";
import Modal from "app/components/Modal";
import { useIntl } from "react-intl";
import { miscMessages } from "app/locale/common";
import { Link, LinkBox } from "app/components/LinkBox";
import { usePromise } from "app/hooks/promises";
import ErrorView from "app/components/ErrorView";
import useSelectedBookmark, { SelectedBookmark } from "./useSelectedBookmark";
import { mergeClasses } from "app/utils";

function useAllBookmarks(): [browser.bookmarks.BookmarkTreeNode | null, any] {
	const [root, error] = usePromise(() => browser.bookmarks.getTree(), []);
	return [root?.[0] ?? null, error];
}

function convertToLinks(children: browser.bookmarks.BookmarkTreeNode[], path: string[], onClick: (link: Link) => void): Link[] {
	const parent = path.join("/") + "/";
	const links: Link[] = children.map(bookmark => {
		if (bookmark.type === "separator") {
			return {
				id: bookmark.id,
				title: "",
				icon: "",
				url: "",
			};
		}
		const id = parent + bookmark.id;
		if (bookmark.type === "folder" || bookmark.children || (bookmark as any).folderType) {
			return {
				id,
				title: bookmark.title,
				icon: "fa-folder",
				url: "",
				children: [],
				onClick,
			};
		}

		return {
			id,
			title: bookmark.title,
			url: bookmark.url ?? "",
			children: [],
		};
	});

	return [
		...links.filter(link => link.icon === "fa-folder"),
		...links.filter(link => link.icon !== "fa-folder")
	];
}

function Breadcrumbs({path, crumbs, onSelect}: {path: string[], crumbs: string[], onSelect: (path: string[]) => void}) {
	if (path.length != crumbs.length) {
		throw Error("Breadcrumbs length mismatch");
	}

	const intl = useIntl();
	const bookmarks = intl.formatMessage(miscMessages.bookmarks);
	const items = useMemo(
		() => {
			let ret = crumbs.map<[string[], string]>((title, i) => [path.slice(0, i + 1), title || bookmarks]);
			if (ret.length <= 5) {
				return ret;
			}
			ret = ret.slice(-5);
			ret[0][1] = "...";
			return ret;
		},
		[bookmarks, crumbs, path]);

	return (
		<div className="breadcrumbs linkbox links-horizontal scrolling bg-secondary p-3">
			{items.map(([x, title], i) => (
					<button
							key={x.join("/")}
							className={mergeClasses(
								"link-item link-item-action",
								i === items.length - 1 && "active")}
							onClick={() => onSelect(x)}>
						{title}
					</button>))}
		</div>
	)
}

function BookmarksList({selected, onSelect}: {selected: SelectedBookmark; onSelect: (path: string[]) => void}) {
	const {node, path, crumbs} = selected;
	const links = useMemo(
		() => convertToLinks(node.children ?? [], path,
			(link) => onSelect(link.id.split("/"))),
		[node, path, onSelect]);

	return (
		<>
			<Breadcrumbs path={path} crumbs={crumbs} onSelect={onSelect}/>
			<LinkBox
				links={links}
				useWebsiteIcons={true}
				widgetTheme={{ showPanelBG: true }}
				defaultIcon="fa-globe-europe"
				errorIcon="fa-globe-europe" />
		</>);
}

function BookmarksModalImpl({path, onNavigate}: {path: string[]; onNavigate: (id: string[] | false) => void}) {
	const [root, error] = useAllBookmarks();
	const selected = useSelectedBookmark(root, path);
	console.log(selected);

	const intl = useIntl();
	const bookmarks = intl.formatMessage(miscMessages.bookmarks);
	return (
		<Modal title={selected?.node?.title || bookmarks} onClose={() => onNavigate(false)} wide={true} fixedTall={true}>
			{selected
				? (<BookmarksList selected={selected} onSelect={onNavigate} />)
				: (<ErrorView error={error} loading={true} panel={false} />)}
		</Modal>);
}

export default function BookmarksModal(props: { children: ReactNode }) {
	const [path, setPath] = useState<string[] | false>(false);
	return (
		<BookmarksModalContext.Provider value={{path, setPath}}>
			{path !== false && (<BookmarksModalImpl path={path} onNavigate={setPath} />)}
			{props.children}
		</BookmarksModalContext.Provider>);
}
