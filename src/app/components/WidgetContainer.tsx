import React, { useEffect, useRef, useState } from "react";
import { Widget } from "./Widget";
import { WidgetManager, WidgetProps } from "app/WidgetManager";
import { WidgetTypes } from "app/widgets";
import { ErrorBoundary } from "./ErrorBoundary";
import WidgetLayouter from "app/WidgetLayouter";
import { Vector2 } from "app/utils/Vector2";
import GridLayout, { Layout } from "react-grid-layout";
import { useForceUpdate } from "app/hooks";


interface WidgetContainerProps {
	wm: WidgetManager;
	isLocked: boolean;
}

export default function WidgetContainer(props: WidgetContainerProps) {
	const widgetManager = props.wm;
	const [gridClassNames, setGridClassNames] = useState("layout");
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		const timer = setTimeout(() => setGridClassNames("layout animated"), 1000);
		return () => clearTimeout(timer);
	}, []);

	function handleRemove(id: number) {
		widgetManager.removeWidget(id);
		forceUpdate();
	}


	const layouter = new WidgetLayouter(new Vector2(15, 12));
	layouter.resolveAll(widgetManager.widgets);

	widgetManager.widgets.sort((a, b) =>
		(a.position!.x + 100 * a.position!.y) -
		(b.position!.x + 100 * b.position!.y));


	const widgets = widgetManager.widgets.map(widget => {
		const props : WidgetProps<any> = {
			...widget,
			child: WidgetTypes[widget.type],
			save: widgetManager.save.bind(widgetManager),
			remove: () => handleRemove(widget.id)
		};

		return (
			<div key={widget.id} className={`widget widget-${widget.type.toLowerCase()}`}>
				<ErrorBoundary>
					<Widget {...props} />
				</ErrorBoundary>
			</div>);
	});


	const [isScrolling, setIsScrolling] = useState(false);
	const mainRef = useRef<HTMLElement>(null);
	function updateIsScrolling() {
		if (mainRef.current) {
			const shouldBeScrolling = mainRef.current.clientHeight > window.innerHeight * 0.8;
			if (isScrolling != shouldBeScrolling) {
				setIsScrolling(shouldBeScrolling);
			}
		}
	}
	useEffect(() => updateIsScrolling);

	const layout : Layout[] = widgetManager.widgets.map(widget => ({
		i: widget.id.toString(),
		x: widget.position?.x ?? 0,
		y: widget.position?.y ?? 0,
		w: widget.size.x,
		h: widget.size.y,
	}));

	function onLayoutChange(layouts: Layout[]) {
		const lut = new Map<string, Layout>();
		layouts.forEach(layout => lut.set(layout.i, layout));

		widgetManager.widgets.forEach(widget => {
			const layout = lut.get(widget.id.toString());
			if (layout) {
				widget.position = new Vector2(layout.x, layout.y);
				widget.size = new Vector2(layout.w, layout.h);
			}
		});

		widgetManager.save();
		updateIsScrolling();
		forceUpdate();
	}


	return (
		<main ref={mainRef} className={isScrolling ? "scrolling" : undefined}>
			<GridLayout className={gridClassNames}
					isDraggable={!props.isLocked} isResizable={!props.isLocked}
					layout={layout} onLayoutChange={onLayoutChange}
					cols={15} rowHeight={50} margin={[16, 16]} width={974}
					draggableHandle=".widget-title">
				{widgets}
			</GridLayout>
		</main>);
}
