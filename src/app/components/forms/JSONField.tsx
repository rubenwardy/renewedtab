import React, { ChangeEvent } from "react";
import { FieldProps } from ".";

export default function JSONField(props: FieldProps<Object | any[]>) {
	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		if (props.onChange) {
			props.onChange(JSON.parse(e.target.value));
		}
	}

	return (
		<textarea name={props.name}
			defaultValue={JSON.stringify(props.value)}
			onChange={handleChange} />);
}
