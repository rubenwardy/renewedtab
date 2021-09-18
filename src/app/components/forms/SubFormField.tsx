import { MyFormattedMessage } from "app/locale/MyMessageDescriptor";
import React from "react";
import { FieldProps } from ".";
import Form from "./Form";


export default function SubFormField(props: FieldProps<any>) {
	return (
		<>
			<h3 className="mt-6">
				<MyFormattedMessage message={props.schemaEntry.label} />
			</h3>
			<Form
				values={props.value}
				schema={props.schemaEntry.subschema!}
				onChange={() => { props.onChange(props.value) }} />
		</>);
}

SubFormField.noParentLabel = true;
