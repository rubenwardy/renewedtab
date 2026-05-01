import { useEffect } from "react";

export function useMarkWidgetLoaded(type: string) {
	useEffect(() => {
		window.performance.mark(`widget-${type}-loaded`);
	}, [type]);
}

export default function MarkWidgetLoaded({widgetType}: {widgetType: string}) {
	useMarkWidgetLoaded(widgetType);
	return false;
}
