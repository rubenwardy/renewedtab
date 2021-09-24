import { createContext, useContext } from "react";

interface GlobalSearch {
    query: string;
    setQuery: (query: string) => void;
}

export const GlobalSearchContext = createContext<GlobalSearch>(undefined as any);

export function useGlobalSearch(): GlobalSearch {
    return useContext(GlobalSearchContext);
}
