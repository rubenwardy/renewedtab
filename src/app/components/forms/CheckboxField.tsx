import { MyFormattedMessage } from "app/locale/MyMessageDescriptor";
import React, { ChangeEvent, useState } from "react";
import { FieldProps } from ".";

export default function CheckboxField(props: FieldProps<boolean>) {
	const [value, setValue] = useState(props.value);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setValue(e.target.checked);
		props.onChange(e.target.checked);
	}

	return (
		<>
			<input type="checkbox" checked={value ?? false} onChange={handleChange} />
			<label className="inline ml-2" htmlFor={props.name}>
				<MyFormattedMessage message={props.schemaEntry.label} />
			</label>
		</>);
}

CheckboxField.noParentLabel = true;
