import AutoWidthInput from "app/components/AutoWidthInput";
import Panel from "app/components/Panel";
import { useStorage } from "app/hooks";
import Schema from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetTheme } from "app/Widget";
import React, { ChangeEvent } from "react";
import { defineMessages, FormattedMessage, MessageDescriptor, useIntl } from "react-intl";


const messages = defineMessages({
	description: {
		defaultMessage: "Greets you",
	},

	editHint: {
		defaultMessage: "You can change the name by clicking it on the widget",
	},

	morning: {
		defaultMessage: "Good morning",
	},

	afternoon: {
		defaultMessage: "Good afternoon",
	},

	evening: {
		defaultMessage: "Good evening",
	},

	name: {
		defaultMessage: "name",
	},
});


function getGreeting(): MessageDescriptor {
	const hour = new Date().getHours();
	if (hour < 12) {
		return messages.morning;
	} else if (hour < 16) {
		return messages.afternoon;
	} else {
		return messages.evening;
	}
}


export default function Greeting(widget: WidgetProps<any>) {
	const [name, setName] = useStorage<string | undefined>("name");

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setName(e.target.value);
	}

	const intl = useIntl();
	return (
		<Panel {...widget.theme}>
			<div className="text-shadow-hard large middle-center">
				<FormattedMessage {...getGreeting()} />,&nbsp;
				{name !== undefined &&
					<AutoWidthInput onChange={handleChange} value={name ?? ""}
							placeholder={intl.formatMessage(messages.name)} />}.
			</div>
		</Panel>);
}


Greeting.description = messages.description;

Greeting.editHint = messages.editHint;

Greeting.initialProps = {};

Greeting.schema = {} as Schema;

Greeting.defaultSize = new Vector2(15, 1);

Greeting.initialTheme = {
	showPanelBG: false,
} as WidgetTheme;
