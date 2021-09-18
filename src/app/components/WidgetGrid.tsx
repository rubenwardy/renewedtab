import React, { CSSProperties, useEffect, useState } from "react";
import { WidgetContainer } from "./WidgetContainer";
import { WidgetManager } from "app/WidgetManager";
import { WidgetTypes } from "app/widgets";
import { ErrorBoundary } from "./ErrorView";
import WidgetLayouter from "app/WidgetLayouter";
import { Vector2 } from "app/utils/Vector2";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { useForceUpdate } from "app/hooks";
import { WidgetProps } from "app/Widget";
import Schema, { type } from "app/utils/Schema";
import { defineMessages } from "react-intl";
import { bindValuesToDescriptor } from "app/locale/MyMessageDescriptor";


export interface WidgetGridSettings {
	fullWidth: boolean;
	columns: number;
	spacing: number;
}


const messages = defineMessages({
	fullWidthLabel: {
		defaultMessage: "Grid Full Width",
		description: "Widget grid: form label for grid full width",
	},

	fullWidthHint: {
		defaultMessage: "Stretch grid to cover the entire page. Requires Reload.",
		description: "Widget grid: form label for grid full width",
	},

	columnsLabel: {
		defaultMessage: "Grid Columns",
		description: "Widget grid: form label for grid columns",
	},

	columnsHint: {
		defaultMessage: "Number of columns in the widget grid. You can fit {max} columns in the current window width ({res}px).",
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

const ReactGridLayout = WidthProvider(GridLayout);

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
		const props : WidgetProps<unknown> = {
			...widget,
			typeDef: WidgetTypes[widget.type],
			save: widgetManager.save.bind(widgetManager),
			remove: () => handleRemove(widget.id)
		};

		return (
			<div key={widget.id} className={`widget widget-${widget.type.toLowerCase()}`}
					data-widget-id={props.id}>
				<ErrorBoundary>
					<WidgetContainer {...props} />
				</ErrorBoundary>
			</div>);
	});

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
		forceUpdate();
	}


	const cellSize = 50;
	const cellSpacing = props.spacing;
	const gridWidth = gridColumns*(cellSize+cellSpacing);
	const mainStyle: CSSProperties = props.fullWidth
		? { minWidth: Math.ceil(gridWidth / 2) * 2, width: "100%" }
		: { width: Math.ceil(gridWidth / 2) * 2 };

	return (
		<main>
			<div className='scroll-wrap'>
				<ReactGridLayout className={gridClassNames} style={mainStyle}
						isDraggable={!props.isLocked} isResizable={!props.isLocked}
						layout={layout} onLayoutChange={onLayoutChange}
						cols={gridColumns} rowHeight={cellSize}
						margin={[cellSpacing, cellSpacing]}
						width={!props.fullWidth ? gridWidth : undefined}
						draggableHandle=".widget-title">
					{widgets}
				</ReactGridLayout>
			</div>
		</main>);
}

export function makeGridSettingsSchema(values: WidgetGridSettings): Schema<WidgetGridSettings> {
	const screenWidth = document.body.clientWidth;
	const hint = bindValuesToDescriptor(messages.columnsHint, {
		max: Math.floor((screenWidth - 10 + values.spacing) / (50 + values.spacing)),
		res: screenWidth,
	})

	return {
		fullWidth: type.boolean(messages.fullWidthLabel, messages.fullWidthHint),
		columns: type.number(messages.columnsLabel, hint, 5),
		spacing: type.unit_number(messages.spacingLabel, "px", messages.spacingHint, 0),
	};
}

export const defaultGridSettings: WidgetGridSettings = {
	fullWidth: false,
	columns: 15,
	spacing: 15,
};
