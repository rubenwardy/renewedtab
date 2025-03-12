import Icon from 'app/components/Icon';
import { schemaMessages } from 'app/locale/common';
import { clampNumber, mergeClasses } from 'app/utils';
import Color from 'app/utils/Color';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { getWebsiteIconOrNull } from 'app/websiteIcons';
import { WidgetProps, WidgetType } from 'app/Widget';
import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Button",
		description: "Button Widget",
	},

	description: {
		defaultMessage: "A link button",
		description: "Button widget description",
	},

	tintOpacityHint: {
		defaultMessage: "Sets the opacity of the button tinted color",
		description: "Button widget: form field hint (Opacity)",
	},
});

interface ButtonProps {
	url: string;
	icon: string;
	text: string;
	useWebsiteIcons: boolean;
}

function Button(props: WidgetProps<ButtonProps>) {
	const data = props.props;

	const color = Color.fromString(props.theme.color ?? "") ?? Color.fromString("#007DB8")!;
	color.a = clampNumber(props.theme.opacity ?? 100, 0, 100) / 100;
	const style: any = {
		"--color-button": color.rgba,
		"--color-button-lighter": color.rgba,
		overflow: "hidden",
	};

	const icon = useMemo(
		() => (data.useWebsiteIcons && getWebsiteIconOrNull(data.url)) || data.icon,
		[data.icon, data.url, data.useWebsiteIcons]);

	const className = mergeClasses(
		"btn btn-custom btn-brighten h-100 w-100 m-0 p-3",
		(props.theme.showPanelBG !== false) && "blur");

	const isHorizontal = props.size.x > 2 * props.size.y;

	return (
		<a href={data.url} style={style} className={className}>
			<div className={mergeClasses("row middle-center h-100", !isHorizontal && "row-vertical")}>
				{icon && (
					<div className={mergeClasses(isHorizontal ? "col-auto" : "col", "p-1 h-100")}
						style={{ position: "relative" }}>
						<Icon icon={icon} />
					</div>)}
				{data.text && (
					<div className={isHorizontal ? "col" : "col-auto"}>
						{data.text}
					</div>)}
			</div>
		</a>);
}


const widget: WidgetType<ButtonProps> = {
	Component: Button,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 1),
	initialProps: {
		url: "https://rubenwardy.com",
		icon: "",
		text: "rubenwardy.com",
		useWebsiteIcons: false,
	},

	async schema(widget) {
		if (typeof browser === "undefined") {
			return {
				url: type.url(schemaMessages.url),
				icon: type.url(schemaMessages.icon),
				text: type.string(schemaMessages.text),
			};
		} else if (widget.props.useWebsiteIcons) {
			return {
				url: type.url(schemaMessages.url),
				text: type.string(schemaMessages.text),
				useWebsiteIcons: type.booleanHostPerm(schemaMessages.useWebsiteIcons),
			};
		} else {
			return {
				url: type.url(schemaMessages.url),
				text: type.string(schemaMessages.text),
				icon: type.url(schemaMessages.icon),
				useWebsiteIcons: type.booleanHostPerm(schemaMessages.useWebsiteIcons),
			};
		}
	},

	initialTheme: {
		showPanelBG: true,
		color: "#007DB8",
		opacity: 40,
	},

	themeSchema: {
		showPanelBG: type.boolean(schemaMessages.showPanelBG),
		color: type.color(schemaMessages.color),
		opacity: type.unit_number(schemaMessages.opacity, "%", messages.tintOpacityHint, 0, 100),
	},
};
export default widget;
