import { createContext, useContext } from "react";

export const LockedContext = createContext<boolean>(false);

export default function useIsLocked(): boolean {
	return useContext(LockedContext);
}
