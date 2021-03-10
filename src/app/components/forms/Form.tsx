import Schema from "app/utils/Schema";
import React from "react";
import { makeField } from ".";

interface FieldListProps {
	values: { [key: string]: any };
	schema: Schema;
	onChange?: (key: string, value: any) => void;
}

/**
 * Automatically creates fields based on the given values and schema.
 */
export default function Form(props: FieldListProps) {
	const inner = Object.entries(props.schema).map(([key, entry]) => {
		const Field = makeField(entry.type);
		return (
			<Field key={key} name={key} value={props.values[key]}
				label={entry.label} hint={entry.hint}
				onChange={(val) => {
					props.values[key] = val;
					props.onChange?.call(null, key, val);
				}} />);
	});

	if (inner.length == 0) {
		inner.push(
			<p className="text-muted" key="none">
				Nothing to edit.
			</p>);
	}

	return (<>{inner}</>);
}