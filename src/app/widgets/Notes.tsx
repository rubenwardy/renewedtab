import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetRaw } from 'app/WidgetManager';
import React, { CSSProperties } from 'react';
import { useAutoTextArea, useStorage } from "../hooks";

interface NotesProps {
	storageKey: string;
}

export default function Notes(props: NotesProps) {
	if (!props.storageKey) {
		return (<div className="panel">Missing storage key</div>);
	}

	const [ notes, setNotes ] = useStorage(props.storageKey, "", [props.storageKey]);
	const ref = useAutoTextArea(undefined, [notes]);

	if (notes == null) {
		return (<div className="panel">Loading notes...</div>);
	}

	function handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
		const element = event.target as HTMLTextAreaElement;
		setNotes(element.value);
	}

	const css: CSSProperties = {};
	css.height = "100%";
	return (
		<div className="panel">
			<textarea ref={ref} className="invisible" onChange={handleChange}
					placeholder="Enter notes here" style={css}
					defaultValue={notes || ""} />
		</div>);
}


Notes.description = "An editable text area for notes";

Notes.initialProps = {
	storageKey: "",
};

Notes.onCreated = function(widget: WidgetRaw<NotesProps>) {
	widget.props.storageKey = `notes-${widget.id}`;
}

Notes.schema = {
	storageKey: type.string("Key"),
} as Schema;

Notes.defaultSize = new Vector2(5, 2);
