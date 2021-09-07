import Panel from 'app/components/Panel';
import { useWidgetProp } from 'app/hooks/widget';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Notes",
		description: "Notes Widget",
	},

	description: {
		defaultMessage: "An editable text area for notes",
		description: "Notes widget description",
	},

	placeholder: {
		defaultMessage: "Enter notes here",
		description: "Notes widget: prompt",
	},
});

export interface NotesProps {
	notes: string;
}

function Notes(widget: WidgetProps<NotesProps>) {
	const [ notes, setNotes ] = useWidgetProp<string>(widget, "notes");

	function handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
		const element = event.target as HTMLTextAreaElement;
		setNotes(element.value);
	}

	const intl = useIntl();
	return (
		<Panel {...widget.theme} scrolling={false}>
			<textarea className="invisible" onChange={handleChange}
					placeholder={intl.formatMessage(messages.placeholder)}
					value={notes || ""} />
		</Panel>);
}


const widget: WidgetType<NotesProps> = {
	Component: Notes,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 2),
	initialProps: {
		notes: ""
	},
	schema: {},
};
export default widget;
