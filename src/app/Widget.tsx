import { MessageDescriptor } from "@formatjs/intl";
import { defineMessages } from "react-intl";
import schemaMessages from "./locale/common";
import Schema, { type } from "./utils/Schema";
import { Vector2 } from "./utils/Vector2";


type ReactFC<T> = ((props: T) => (JSX.Element | null));

export interface WidgetTheme {
	showPanelBG: boolean;
	useIconBar?: boolean;
	color?: string;
	opacity?: number;
}

export interface WidgetType<T> extends ReactFC<WidgetProps<T>> {
	defaultSize: Vector2;

	/**
	 * Initial properties
	 */
	initialProps: T;

	/**
	 * Schema for the props, used to generate WidgetEditor forms.
	 */
	schema: Schema | ((widget: Widget<T>) => Schema);

	/**
	 * Description shown in Create Widget dialog.
	 */
	description: MessageDescriptor;

	/**
	 * Whether the widget requires the browser version
	 */
	isBrowserOnly?: boolean;

	/**
	 * Hint to be shown in the WidgetEditor.
	 */
	editHint?: MessageDescriptor;

	/**
	 * Initial values for shared theme settings
	 */
	initialTheme?: WidgetTheme;

	/**
	 * Schema for theme
	 */
	themeSchema?: Schema | ((widget: Widget<T>) => Schema);

	/**
	 * Called when the widget is created, either by the user
	 * or from defaults.
	 */
	onCreated?: (widget: Widget<T>) => void;

	/**
	 * Called when the widget is loaded from save.
	 */
	onLoaded?: (widget: Widget<T>) => Promise<void>;
}

export interface Widget<T> {
	id: number;
	type: string;
	props: T;
	theme: WidgetTheme;

	position?: Vector2;
	size: Vector2;
}

export interface WidgetProps<T> extends Widget<T> {
	child: WidgetType<T>;
	save(): void;
	remove(): void;
}


const messages = defineMessages({
	showPanelBG: {
		defaultMessage: "Show panel background",
	},
});

export const defaultThemeSchema: Schema = {
	showPanelBG: type.boolean(messages.showPanelBG),
};


export const defaultLinksThemeSchema: Schema = {
	showPanelBG: type.boolean(messages.showPanelBG),
	useIconBar: type.boolean(schemaMessages.useIconBar),
};


/**
 * Gets the schema for a widget
 *
 * @param widget Widget data
 * @param type Widget type
 * @returns schema
 */
export function getSchemaForWidget<T>(widget: Widget<T>, type: WidgetType<T>): Schema {
	if (typeof type.schema == "function") {
		return type.schema(widget);
	} else {
		return type.schema;
	}
}


/**
 * Gets the schema for a widget
 *
 * @param widget Widget data
 * @param type Widget type
 * @returns schema
 */
 export function getThemeSchemaForWidget<T>(widget: Widget<T>, type: WidgetType<T>): Schema {
	if (typeof type.themeSchema == "undefined") {
		return defaultThemeSchema;
	} else if (typeof type.themeSchema == "function") {
		return type.themeSchema(widget);
	} else {
		return type.themeSchema;
	}
}


/**
 * Gets default theme for a widget
 *
 * @param type Widget type
 * @returns theme
 */
export function getInitialTheme(type: WidgetType<any>): WidgetTheme {
	if (typeof type.initialTheme !== "undefined") {
		return type.initialTheme;
	}

	return {
		showPanelBG: true,
		useIconBar: false,
		color: undefined,
	}
}
