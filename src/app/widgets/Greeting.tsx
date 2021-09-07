import AutoWidthInput from "app/components/AutoWidthInput";
import Panel from "app/components/Panel";
import { useStorage } from "app/hooks";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetType } from "app/Widget";
import React, { ChangeEvent } from "react";
import { defineMessages, FormattedMessage, MessageDescriptor, useIntl } from "react-intl";


const messages = defineMessages({
	title: {
		defaultMessage: "Greeting",
		description: "Greeting Widget",
	},

	description: {
		defaultMessage: "Greets you",
		description: "Greeting widget description",
	},

	editHint: {
		defaultMessage: "You can change the name by clicking it on the widget",
		description: "Greeting widget: edit modal hint",
	},

	morning: {
		defaultMessage: "Good morning",
		description: "Greeting widget: greeting, from midnight to noon",
	},

	afternoon: {
		defaultMessage: "Good afternoon",
		description: "Greeting widget: greeting, from noon to 4pm",
	},

	evening: {
		defaultMessage: "Good evening",
		description: "Greeting widget: greeting, from 4pm to 9pm",
	},

	night: {
		defaultMessage: "Good night",
		description: "Greeting widget: greeting, from 9pm to midnight",
	},

	name: {
		defaultMessage: "name",
		description: "Greeting widget: name prompt",
	},
});


function getGreeting(): MessageDescriptor {
	const hour = new Date().getHours();
	if (hour < 12) {
		return messages.morning;
	} else if (hour < 16) {
		return messages.afternoon;
	} else if (hour < 21) {
		return messages.evening;
	} else {
		return messages.night;
	}
}


function Greeting(widget: WidgetProps<Record<string, never>>) {
	const [name, setName] = useStorage<string | undefined>("name");

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setName(e.target.value);
	}

	const intl = useIntl();
	return (
		<Panel {...widget.theme}>
			<div className="large middle-center">
				<FormattedMessage {...getGreeting()} />,&nbsp;
				{name !== undefined &&
					<AutoWidthInput onChange={handleChange} value={name ?? ""}
							placeholder={intl.formatMessage(messages.name)} />}.
			</div>
		</Panel>);
}


const widget: WidgetType<Record<string, never>> = {
	Component: Greeting,
	title: messages.title,
	description: messages.description,
	editHint: messages.editHint,
	defaultSize: new Vector2(15, 1),
	initialProps: {},
	schema: {},
	initialTheme: {
		showPanelBG: false,
	},
};
export default widget;
