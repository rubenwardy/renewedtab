import Schema from "app/utils/Schema";
import React from "react";
import { makeField } from ".";

export interface FormProps {
	values: { [key: string]: any };
	schema: Schema;
	showEmptyView?: boolean;
	onChange?: (key: string, value: any) => void;
}

/**
 * Automatically creates fields based on the given values and schema.
 */
export default function Form(props: FormProps) {
	const inner = Object.entries(props.schema).map(([key, entry]) => {
		const Field = makeField(entry.type);
		return (
			<Field key={key} name={key} value={props.values[key]}
				schemaEntry={entry} type={entry.type}
				onChange={(val) => {
					props.values[key] = val;
					props.onChange?.call(null, key, val);
				}} />);
	});

	if (inner.length == 0 && props.showEmptyView !== false) {
		inner.push(
			<p className="text-muted" key="none">
				Nothing to edit.
			</p>);
	}

	return (<div className="form">{inner}</div>);
}
