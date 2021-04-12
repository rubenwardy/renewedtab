import { MessageDescriptor } from "@formatjs/intl";
import Schema from "./utils/Schema";
import { Vector2 } from "./utils/Vector2";


type ReactFC<T> = ((props: T) => (JSX.Element | null));

export interface WidgetType<T> extends ReactFC<WidgetProps<T>> {
	initialProps: T;
	defaultSize: Vector2;

	/**
	 * Schema for the props, used to generate WidgetEditor forms.
	 */
	schema: Schema | ((widget: Widget<T>) => Schema);

	/**
	 * Description shown in Create Widget dialog.
	 */
	description: MessageDescriptor;

	isBrowserOnly?: boolean;

	/**
	 * Hint to be shown in the WidgetEditor.
	 */
	editHint?: MessageDescriptor;

	/**
	 * Called when the widget is created, either by the user
	 * or from defaults.
	 */
	onCreated?: (widget: Widget<T>) => void;

	/**
	 * Called when the widget is loaded from save.
	 */
	onLoaded?: (widget: Widget<T>) => void;
}

export interface Widget<T> {
	id: number;
	type: string;
	props: T;

	position?: Vector2;
	size: Vector2;
}

export interface WidgetProps<T> extends Widget<T> {
	child: WidgetType<T>;
	save(): void;
	remove(): void;
}


/**
 * Gets the schema for a widget
 */
export function getSchemaForWidget<T>(widget: Widget<T>, type: WidgetType<T>): Schema {
	if (typeof type.schema == "function") {
		return type.schema(widget);
	} else {
		return type.schema;
	}
}
