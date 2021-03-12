import React from "react";
import { FieldProps } from ".";


export default function ImageUploadField(props: FieldProps<string>) {
	return (
		<div className="field">
			<label htmlFor={props.name}>{props.schemaEntry.label ?? props.name}</label>
			<input type="file" />
		</div>);
}
