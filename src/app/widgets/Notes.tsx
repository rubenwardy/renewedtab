import { Vector2 } from 'app/utils/Vector2';
import React, { CSSProperties, useState } from 'react';
import { useAutoTextArea } from "../utils/hooks";

interface NotesProps {
	localStorageKey: string;
}

export default function Notes(props: NotesProps) {
	const [ notes, setNotes ] = useState(localStorage.getItem(props.localStorageKey));
	const ref = useAutoTextArea(undefined, [notes]);

	function handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
		const element = event.target as HTMLTextAreaElement;
		localStorage.setItem(props.localStorageKey, element.value);
		setNotes(element.value);
	}

	React.useEffect(() => {
		const value = localStorage.getItem(props.localStorageKey);
		if (ref.current) {
			ref.current.value = value ?? "";
		}
		setNotes(value);
	}, [props.localStorageKey]);

	const css: CSSProperties = {};
	css.height = "100%";

	return (
		<div className="panel">
			<textarea ref={ref} className="invisible" onChange={handleChange}
					placeholder="Enter notes here" style={css}
					defaultValue={notes || ""} />
		</div>);
}


Notes.defaultProps = {
	localStorageKey: "notes",
};

Notes.schema = {
	localStorageKey: "string",
};

Notes.defaultSize = new Vector2(5, 2);
