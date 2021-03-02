import React, { useState } from 'react';
import { useAutoTextArea } from "../hooks";

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

	return (<div className="panel">
		<textarea ref={ref} className="invisble" onChange={handleChange}
				placeholder="Enter notes here"
				defaultValue={notes || ""} />
	</div>);
}
