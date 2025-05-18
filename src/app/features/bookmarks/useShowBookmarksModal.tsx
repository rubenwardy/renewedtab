import { Link } from "app/components/LinkBox";
import { createContext, useCallback, useContext } from "react";

interface BookmarksModalContext {
	path: string[] | false;
	setPath: (id: string[]) => void;
}

export const BookmarksModalContext = createContext<BookmarksModalContext>(undefined as any);

export default function useShowBookmarksModal(): (link: Link) => void {
	const {setPath} = useContext(BookmarksModalContext);
	return useCallback((link: Link) => setPath([link.id]), [setPath]);
}
