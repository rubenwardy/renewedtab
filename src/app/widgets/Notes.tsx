import React, { useState } from 'react';
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

	return (
		<div className="panel">
			<textarea ref={ref} className="invisible" onChange={handleChange}
					placeholder="Enter notes here"
					defaultValue={notes || ""} />
		</div>);
}


Notes.defaultProps = {
	localStorageKey: "notes"
};
