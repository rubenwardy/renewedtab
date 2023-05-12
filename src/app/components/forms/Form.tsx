import { mergeClasses } from "app/utils";
import Schema, { SchemaEntry } from "app/utils/Schema";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Field } from "./Field";


type stringKeyOf<T> = keyof T & string;



export interface FormProps<T> {
	values: T;
	schema: Schema<T>;
	showEmptyView?: boolean;
	table?: boolean;
	onChange?: (key: stringKeyOf<T>, value: any) => void;
	className?: string;
}


function makeFieldEle<T>(props: FormProps<T>, key: stringKeyOf<T>, entry: SchemaEntry): JSX.Element {
	const field = (
		<Field key={key} name={key} value={props.values[key]} schemaEntry={entry}
			fieldOnly={props.table ?? false}
			onChange={(val) => {
				props.values[key] = val;
				props.onChange?.call(null, key, val);
			}} />);

	const className = mergeClasses("field",
		typeof entry.type == "string" && `field-${entry.type}`);
	if (props.table) {
		return (<td key={key} className={className}>{field}</td>);
	} else {
		return (<div key={key} className={className} data-cy={`field-${key}`}>{field}</div>);
	}
}


/**
 * Automatically creates fields based on the given values and schema.
 */
export default function Form<T>(props: FormProps<T>) {
	const inner = Object.entries(props.schema).map(([key, entry]) =>
		makeFieldEle(props, key as keyof Schema<T>, entry as SchemaEntry));

	if (inner.length == 0 && props.showEmptyView !== false) {
		inner.push(
			<p className="text-muted" key="none">
				<FormattedMessage
						defaultMessage="Nothing to edit."
						description="Form has no fields" />
			</p>);
	}

	if (props.table) {
		return (<>{inner}</>);
	} else {
		return (
			<div className={mergeClasses("form", props.className)}>
				{inner}
			</div>);
	}
}
