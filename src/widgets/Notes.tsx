import React, { useState } from 'react';
import { useAutoTextArea } from "../hooks";
import { Widget } from '../Widget';

interface NotesProps {
	localStorageKey: string;
}

export function Notes(props: NotesProps) {
	const [ notes, setNotes ] = useState(localStorage.getItem(props.localStorageKey));
	const ref = useAutoTextArea(undefined, [notes]);

	function handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
		const element = event.target as HTMLTextAreaElement;
		localStorage.setItem(props.localStorageKey, element.value);
		setNotes(element.value);
	}

	React.useEffect(() => {
		setNotes(localStorage.getItem(props.localStorageKey));
	}, [props.localStorageKey]);

	return (
		<Widget type="Notes" props={props}>
			<textarea ref={ref} className="invisible" onChange={handleChange}
					placeholder="Enter notes here"
					defaultValue={notes || ""} />
		</Widget>);
}
