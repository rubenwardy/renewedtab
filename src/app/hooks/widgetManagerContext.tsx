import { WidgetManager } from "app/WidgetManager";
import { createContext, useContext } from "react";


export const WidgetManagerContext = createContext<WidgetManager>(undefined as any);

export function useWidgetManager(): WidgetManager {
	return useContext(WidgetManagerContext);
}
