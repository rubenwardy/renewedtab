import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Widget } from "./Widget";
import { WidgetManager, WidgetProps } from "app/WidgetManager";
import { WidgetTypes } from "app/widgets";
import { ErrorBoundary } from "./ErrorBoundary";
import WidgetLayouter from "app/WidgetLayouter";
import { Vector2 } from "app/utils/Vector2";
import GridLayout, { Layout } from "react-grid-layout";


export default function WidgetContainer(props: { wm: WidgetManager }) {
	const widgetManager = props.wm;
	const [gridClassNames, setGridClassNames] = useState("layout");
	const [, setUpdate] = useState({});

	useEffect(() => {
		const timer = setTimeout(() => setGridClassNames("layout animated") , 1);
		return () => clearTimeout(timer);
	}, []);

	function handleRemove(id: number) {
		widgetManager.removeWidget(id);
		setUpdate({});
	}

	const layouter = new WidgetLayouter(new Vector2(15, 12));
	layouter.resolveAll(widgetManager.widgets);

	const widgets = widgetManager.widgets.map(widget => {
		const props : WidgetProps<any> = {
			...widget,
			child: WidgetTypes[widget.type],
			save: widgetManager.save.bind(widgetManager),
			remove: () => handleRemove(widget.id)
		};

		return (
			<div key={widget.id} className="widget">
				<ErrorBoundary>
					<Widget {...props} />
				</ErrorBoundary>
			</div>);
	});


	const [isScrolling, setIsScrolling] = useState(false);
	const mainRef = useRef<HTMLElement>(null);
	function updateIsScrolling() {
		if (mainRef.current) {
			console.log(mainRef.current.clientHeight, window.innerHeight * 0.8);
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
	}


	return (
		<main ref={mainRef} className={isScrolling ? "scrolling" : ""}>
			<GridLayout className={gridClassNames}
					layout={layout} onLayoutChange={onLayoutChange}
					cols={15} rowHeight={50} margin={[16, 16]} width={974}
					draggableHandle=".widget-title">
				{widgets}
			</GridLayout>
		</main>);
}
