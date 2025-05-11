import { usePromise } from "app/hooks/promises";
import { parseURL } from "app/utils";
import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { FieldProps } from ".";
import RequestHostPermission from "app/components/RequestHostPermission";

export default function FeedURLField(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value);
	const ref = useRef<HTMLInputElement>(null);

	function handleBlurOrPermission() {
		if (!ref.current!.checkValidity()) {
			return;
		}

		props.onChange(value);
	}

	const host = parseURL(value)?.host ?? "";
	const intl = useIntl();
	const [autocomplete, ] =
		usePromise(() => props.schemaEntry.autocomplete?.(intl) ?? Promise.resolve(null), []);

	return (
		<>
			<input type="url" name={props.name} value={value} ref={ref}
					autoComplete={autocomplete ? "off" : "on"}
					onChange={e => setValue(e.target.value)}
					onBlur={handleBlurOrPermission}
					list={autocomplete ? `dl-${props.name}` : undefined} />

			{autocomplete &&
				<datalist id={`dl-${props.name}`}>
					{autocomplete.map(v => (
						<option key={v.value} value={v.value}>{v.label}</option>))}
				</datalist>}

			<RequestHostPermission host={host} onHasPermission={handleBlurOrPermission} />
			{/* <URLSubmitter url={value} autocomplete={autocomplete ?? undefined} /> */}
		</>);
}
