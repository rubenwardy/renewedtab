import Panel from 'app/components/Panel';
import { useWidgetProp } from 'app/hooks/widget';
import { storage } from 'app/Storage';
import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { Widget, WidgetProps } from 'app/Widget';
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

interface NotesProps {
	notes: string;
}

export default function Notes(widget: WidgetProps<NotesProps>) {
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


Notes.title = messages.title;
Notes.description = messages.description;

Notes.initialProps = {
	notes: "",
};

Notes.onLoaded = async (widget: Widget<any>) => {
	if (widget.props.storageKey &&
			(widget.props.notes == undefined || widget.props.notes === "")) {
		widget.props.notes = "";

		const value = await storage.get(widget.props.storageKey);
		if (typeof value == "string") {
			widget.props.notes = value;
			delete widget.props.storageKey;
		}
	}
}

Notes.schema = {} as Schema;

Notes.defaultSize = new Vector2(5, 2);
