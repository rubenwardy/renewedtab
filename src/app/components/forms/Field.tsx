import { SchemaEntry } from "app/utils/Schema";
import React from "react";
import { FormattedMessage } from "react-intl";
import { makeField } from ".";


interface FieldProps {
	name: string;
	schemaEntry: SchemaEntry;
	value: any;
	fieldOnly: boolean;
	onChange: (value: any) => void;
}

export function Field(props: FieldProps) {
	const SubField = makeField(props.schemaEntry.type);
	const showLabel = !props.fieldOnly && !(SubField as any).noParentLabel;
	const showHint = !props.fieldOnly;

	return (
		<>
			{showLabel &&
				<label htmlFor={props.name}>
					<FormattedMessage {...props.schemaEntry.label} />
				</label>}

			<SubField name={props.name} value={props.value}
					schemaEntry={props.schemaEntry} type={props.schemaEntry.type}
					onChange={props.onChange} />

			{showHint && props.schemaEntry.hint &&
				<p className="text-muted">
					<FormattedMessage {...props.schemaEntry.hint} />
				</p>}
		</>);
}
