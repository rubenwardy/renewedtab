import { useWidgetProp } from 'app/hooks/widget';
import { storage } from 'app/Storage';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { Widget, WidgetProps } from 'app/Widget';
import React from 'react';
import { useStorage } from "../hooks";


interface NotesProps {
	notes: string;
}

export default function Notes(widget: WidgetProps<NotesProps>) {
	const [ notes, setNotes ] = useWidgetProp<string>(widget, "notes");

	function handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
		const element = event.target as HTMLTextAreaElement;
		setNotes(element.value);
	}

	return (
		<div className="panel">
			<textarea className="invisible" onChange={handleChange}
					placeholder="Enter notes here"
					value={notes || ""} />
		</div>);
}


Notes.description = "An editable text area for notes";

Notes.initialProps = {
	notes: "",
};

Notes.onLoaded = function(widget: Widget<any>) {
	if (widget.props.storageKey) {
		widget.props.notes = "";

		storage.get(widget.props.storageKey).then((value) => {
			if (typeof value == "string") {
				widget.props.notes = value;
			}
		});

		widget.props.storageKey = undefined;
	}
}

Notes.schema = {} as Schema;

Notes.defaultSize = new Vector2(5, 2);
