import { MyFormattedMessage } from "app/locale/MyMessageDescriptor";
import { SchemaEntry } from "app/utils/Schema";
import React from "react";
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
	const showLabel = !props.fieldOnly && !SubField.noParentLabel;
	const showHint = !props.fieldOnly;

	return (
		<>
			{showLabel &&
				<label htmlFor={props.name}>
					<MyFormattedMessage message={props.schemaEntry.label} />
				</label>}

			<SubField name={props.name} value={props.value}
					schemaEntry={props.schemaEntry} type={props.schemaEntry.type}
					onChange={props.onChange} />

			{showHint && props.schemaEntry.hint &&
				<p className="text-muted">
					<MyFormattedMessage message={props.schemaEntry.hint} />
				</p>}
		</>);
}
