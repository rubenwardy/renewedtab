import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { WidgetContainer } from "./WidgetContainer";
import { WidgetManager } from "app/WidgetManager";
import { WidgetTypes } from "app/widgets";
import { ErrorBoundary } from "./ErrorView";
import WidgetLayouter from "app/WidgetLayouter";
import { Vector2 } from "app/utils/Vector2";
import GridLayout, { Layout } from "react-grid-layout";
import { useForceUpdate } from "app/hooks";
import { WidgetProps } from "app/Widget";
import Schema, { type } from "app/utils/Schema";
import { defineMessages } from "react-intl";


export interface WidgetGridSettings {
	columns: number;
	spacing: number;
}


const messages = defineMessages({
	columnsLabel: {
		defaultMessage: "Grid Columns",
		description: "Widget grid: form label for grid columns",
	},

	columnsHint: {
		defaultMessage: "Number of columns in the widget grid. Each column is roughly 50px plus spacing, so with 15px spacing, the maximum a 1080p window should have is 30 columns.",
		description: "Widget grid: form hint for grid columns",
	},

	spacingLabel: {
		defaultMessage: "Grid Spacing",
		description: "Widget grid: form label for grid spacing",
	},

	spacingHint: {
		defaultMessage: "The spacing between widgets, in pixels.",
		description: "Widget grid: form hint for grid spacing",
	},
});


interface WidgetGridProps extends WidgetGridSettings {
	wm: WidgetManager;
	isLocked: boolean;
}

export default function WidgetGrid(props: WidgetGridProps) {
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

	const gridColumns = props.columns;


	const layouter = new WidgetLayouter(new Vector2(gridColumns, 12));
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
					<WidgetContainer {...props} />
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


	const cellSize = 50;
	const cellSpacing = props.spacing;
	const gridWidth = gridColumns*(cellSize+cellSpacing);
	const mainStyle: CSSProperties = {
		width: gridWidth
	};

	return (
		<main ref={mainRef} className={isScrolling ? "scrolling" : undefined} style={mainStyle}>
			<GridLayout className={gridClassNames}
					isDraggable={!props.isLocked} isResizable={!props.isLocked}
					layout={layout} onLayoutChange={onLayoutChange}
					cols={gridColumns} rowHeight={cellSize}
					margin={[cellSpacing, cellSpacing]}
					width={gridWidth}
					draggableHandle=".widget-title">
				{widgets}
			</GridLayout>
		</main>);
}

export const gridSettingsSchema: Schema = {
	columns: type.number(messages.columnsLabel, messages.columnsHint),
	spacing: type.unit_number(messages.spacingLabel, "px", messages.spacingHint),
};

export const defaultGridSettings: WidgetGridSettings = {
	columns: 15,
	spacing: 15,
};
