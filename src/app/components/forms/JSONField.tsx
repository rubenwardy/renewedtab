import React, { ChangeEvent } from "react";
import { FieldProps } from ".";

export function JSONField(props: FieldProps<Object | any[]>) {
	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		if (props.onChange) {
			props.onChange(JSON.parse(e.target.value));
		}
	}

	const hint = props.hint ? (<p className="text-muted">{props.hint}</p>) : null;
	return (
		<div className="field">
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<textarea name={props.name}
					defaultValue={JSON.stringify(props.value)}
					onChange={handleChange} />
			{hint}
		</div>);
}
