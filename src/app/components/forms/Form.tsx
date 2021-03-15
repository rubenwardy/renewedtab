import Schema, { SchemaEntry } from "app/utils/Schema";
import React from "react";
import { Field } from "./Field";


export interface FormProps {
	values: { [key: string]: any };
	schema: Schema;
	showEmptyView?: boolean;
	table?: boolean;
	onChange?: (key: string, value: any) => void;
}


function makeFieldEle(props: FormProps, key: string, entry: SchemaEntry): JSX.Element {
	const field = (
		<Field key={key} name={key} value={props.values[key]} schemaEntry={entry}
			fieldOnly={props.table ?? false}
			onChange={(val) => {
				props.values[key] = val;
				props.onChange?.call(null, key, val);
			}} />);

	if (props.table) {
		return (<td key={key} className="field">{field}</td>);
	} else {
		return (<div key={key} className="field">{field}</div>);
	}
}


/**
 * Automatically creates fields based on the given values and schema.
 */
export default function Form(props: FormProps) {
	const inner = Object.entries(props.schema).map(([key, entry]) =>
		makeFieldEle(props, key, entry));

	if (inner.length == 0 && props.showEmptyView !== false) {
		inner.push(
			<p className="text-muted" key="none">
				Nothing to edit.
			</p>);
	}

	if (props.table) {
		return (<>{inner}</>);
	} else {
		return (<div className="form">{inner}</div>);
	}
}
