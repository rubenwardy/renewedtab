import { MessageDescriptor } from "@formatjs/intl";
import { defineMessages, IntlShape } from "react-intl";
import { schemaMessages } from "./locale/common";
import { MyMessageDescriptor } from "./locale/MyMessageDescriptor";
import { enumToValue } from "./utils/enum";
import Schema, { type } from "./utils/Schema";
import { Vector2 } from "./utils/Vector2";


type ReactFC<T> = ((props: T) => (JSX.Element | null));


export enum ListBoxStyle {
	Vertical,
	Horizontal,
	Icons,
}


export const listBoxStyleMessages = defineMessages({
	[ListBoxStyle.Vertical]: {
		defaultMessage: "Vertical",
		description: "List box style (ie: list/bookmark widgets)",
	},
	[ListBoxStyle.Horizontal]: {
		defaultMessage: "Horizontal",
		description: "List box style (ie: list/bookmark widgets)",
	},
	[ListBoxStyle.Icons]: {
		defaultMessage: "Icons",
		description: "List box style (ie: list/bookmark widgets)",
	},
});


export interface WidgetTheme {
	showPanelBG: boolean;
	listBoxStyle?: ListBoxStyle;
	showText?: boolean;
	color?: string;
	textColor?: string;
	opacity?: number;
	fontScaling?: number;
}

export interface WidgetEditComponentProps<T> extends WidgetProps<T> {
	onChange: () => void;
}

export interface WidgetType<T> {
	Component: ReactFC<WidgetProps<T>>;

	title: MessageDescriptor;
	description: MessageDescriptor;


	defaultSize: Vector2;

	/**
	 * Initial properties
	 */
	initialProps: T;

	/**
	 * Schema for the props, used to generate WidgetEditor forms.
	 */
	schema: Schema<T> | ((widget: Widget<T>, intl: IntlShape) => Promise<Schema<T>>);

	/**
	 * Whether the widget requires the browser version
	 */
	isBrowserOnly?: boolean;

	/**
	 * Hint to be shown in the WidgetEditor.
	 */
	editHint?: MyMessageDescriptor;

	/**
	 * A component to be shown in the WidgetEditor.
	 */
	editHeaderComponent?: ReactFC<WidgetEditComponentProps<T>>;

	/**
	 * Initial values for shared theme settings
	 */
	initialTheme?: WidgetTheme;

	/**
	 * Schema for theme
	 */
	themeSchema?: Schema<WidgetTheme> | ((widget: Widget<T>) => Schema<WidgetTheme>);

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
	typeDef: WidgetType<T>;
	save(): void;
	remove(): void;
	duplicate(): void;
}


export const defaultThemeSchema: Schema<WidgetTheme> = {
	showPanelBG: type.boolean(schemaMessages.showPanelBG),
	fontScaling: type.unit_number(schemaMessages.fontScaling, "%", undefined, 80, 200),
};

export const onlyPanelThemeSchema: Schema<WidgetTheme> = {
	showPanelBG: type.boolean(schemaMessages.showPanelBG),
};


export function defaultLinksThemeSchema(widget: Widget<unknown>): Schema<WidgetTheme> {
	const listBoxStyle = enumToValue(ListBoxStyle,
			widget.theme.listBoxStyle ?? ListBoxStyle.Vertical);
	if (listBoxStyle !== ListBoxStyle.Vertical) {
		return {
			showPanelBG: type.boolean(schemaMessages.showPanelBG),
			showText: type.boolean(schemaMessages.showText),
			listBoxStyle: type.selectEnum(ListBoxStyle, listBoxStyleMessages, schemaMessages.listBoxStyle),
			fontScaling: type.unit_number(schemaMessages.fontScaling, "%", undefined, 80, 200),
		};
	} else {
		return {
			showPanelBG: type.boolean(schemaMessages.showPanelBG),
			listBoxStyle: type.selectEnum(ListBoxStyle, listBoxStyleMessages, schemaMessages.listBoxStyle),
			fontScaling: type.unit_number(schemaMessages.fontScaling, "%", undefined, 80, 200),
		};
	}
}


/**
 * Gets the schema for a widget
 *
 * @param widget Widget data
 * @param type Widget type
 * @returns schema
 */
export async function getSchemaForWidget<T>(widget: Widget<T>,
		type: WidgetType<T>, intl: IntlShape): Promise<Schema<T>> {
	if (typeof type.schema == "function") {
		return await type.schema(widget, intl);
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
 export function getThemeSchemaForWidget<T>(widget: Widget<T>, type: WidgetType<T>): Schema<WidgetTheme> {
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
export function getInitialTheme(type: WidgetType<unknown>): WidgetTheme {
	const defaultInitial: WidgetTheme =  {
		showPanelBG: true,
		listBoxStyle: ListBoxStyle.Vertical,
		color: undefined,
		textColor: undefined,
		showText: true,
		fontScaling: 100,
	};

	if (typeof type.initialTheme !== "undefined") {
		return { ...defaultInitial, ...type.initialTheme };
	}

	return defaultInitial;
}
