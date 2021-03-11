import React, { ChangeEvent } from "react";
import { FieldProps } from ".";

export default function JSONField(props: FieldProps<Object | any[]>) {
	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		if (props.onChange) {
			props.onChange(JSON.parse(e.target.value));
		}
	}

	return (
		<div className="field">
			<label htmlFor={props.name}>{props.schemaEntry.label ?? props.name}</label>
			<textarea name={props.name}
					defaultValue={JSON.stringify(props.value)}
					onChange={handleChange} />

			{props.schemaEntry.hint &&
				<p className="text-muted">{props.schemaEntry.hint}</p>}
		</div>);
}
