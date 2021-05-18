import { useForceUpdate, usePromise } from "app/hooks";
import { clearWebsiteIcons } from "app/WebsiteIcon";
import React, { ChangeEvent, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { FieldProps } from ".";
import RequestHostPermission from "../RequestHostPermission";
import RequestPermission from "../RequestPermission";


const messages = defineMessages({
	grantAll: {
		defaultMessage: "Grant permission to access all websites",
	},
});

export function HostURLFIeld(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
		setValue(e.target.value);
	}

	let host = "";
	try {
		host = new URL(value).host;
	} catch (e) {
		// ignore
	}

	const intl = useIntl();
	const [autocomplete, ] = props.schemaEntry.autocomplete
			? usePromise(() => props.schemaEntry.autocomplete!(intl), [])
			: [ null, null ];

	return (
		<>
			<input type="url" name={props.name} defaultValue={props.value}
					autoComplete={autocomplete ? "off" : "on"}
					onChange={handleChange} list={autocomplete ? `dl-${props.name}` : undefined} />

			{autocomplete &&
				<datalist id={`dl-${props.name}`}>
					{autocomplete.map(v => (
						<option key={v.value} value={v.value}>{v.label}</option>))}
				</datalist>}

			<RequestHostPermission host={host} />
		</>);
}


export function HostAllField(props: FieldProps<boolean>) {
	const [value, setValue] = useState(props.value);
	const forceUpdate = useForceUpdate();
	const intl = useIntl();

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			setValue(e.target.checked);
			props.onChange(e.target.checked);
		}
	}

	function onResult() {
		clearWebsiteIcons();
		forceUpdate();
	}

	const permissions: browser.permissions.Permissions = {
		permissions: [],
		origins: ["*://*/"],
	};

	const [needsPermission,] =
		usePromise(async () => ! await browser.permissions.contains(permissions),
				[forceUpdate]);

	return (
		<>
			<input type="checkbox" checked={value ?? false} onChange={handleChange} />
			<label className="inline ml-2" htmlFor={props.name}>
				{intl.formatMessage(props.schemaEntry.label)}
			</label>

			{needsPermission && value && (
				<p>
					<RequestPermission permissions={permissions}
						label={intl.formatMessage(messages.grantAll)}
						onResult={onResult} />
				</p>)}
		</>);
}

HostAllField.noParentLabel = true;
