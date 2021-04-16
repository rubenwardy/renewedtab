import { useWidgetProp } from 'app/hooks/widget';
import { storage } from 'app/Storage';
import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { Widget, WidgetProps } from 'app/Widget';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';


const messages = defineMessages({
	description: {
		defaultMessage: "An editable text area for notes",
	},

	placeholder: {
		defaultMessage: "Enter notes here",
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
		<div className="panel">
			<textarea className="invisible" onChange={handleChange}
					placeholder={intl.formatMessage(messages.placeholder)}
					value={notes || ""} />
		</div>);
}


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
			widget.props.storageKey = undefined;
		}
	}
}

Notes.schema = {} as Schema;

Notes.defaultSize = new Vector2(5, 2);
