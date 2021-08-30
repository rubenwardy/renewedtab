import React, { useEffect, useState } from "react";
import { FieldProps } from ".";


export default function JSONField(props: FieldProps<any | any[]>) {
	const [value, setValue] = useState<string>(JSON.stringify(props.value) ?? "");
	useEffect(() => setValue(JSON.stringify(props.value)), [props.value]);

	function handleBlur() {
		props.onChange(JSON.parse(value));
	}

	return (
		<textarea name={props.name} value={value}
			onChange={e => setValue(e.target.value)}
			onBlur={handleBlur}
			className="fullwidth" />);
}
