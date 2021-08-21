import React, { useState } from "react";
import { useIntl } from "react-intl";
import { FieldProps } from ".";


export default function SelectField(props: FieldProps<any>) {
	const options: Record<string, string> = props.schemaEntry.values;
	const [value, setValue] = useState(props.value);
	const intl = useIntl();

	function handleChanged(newMode: string) {
		if (props.onChange) {
			props.onChange(newMode);
		}
		setValue(newMode);
	}

	function getLabel(key: any) {
		const descriptor = props.schemaEntry.messages && props.schemaEntry.messages[key];
		if (descriptor) {
			return intl.formatMessage(descriptor);
		} else {
			return options[key];
		}
	}

	const optionsView =
		Object.entries(options).map(([key]) => (
				<option className="field" key={key} value={key}>
					{getLabel(key)}
				</option>));
	return (
		<select name="mode" value={value} onChange={(e) => handleChanged(e.target.value)}>
			{optionsView}
		</select>);
}
