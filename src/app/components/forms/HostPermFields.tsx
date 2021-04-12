import { useForceUpdate, usePromise } from "app/hooks";
import { clearWebsiteIcons } from "app/WebsiteIcon";
import React, { ChangeEvent, useState } from "react";
import { FieldProps } from ".";
import RequestHostPermission from "../RequestHostPermission";
import RequestPermission from "../RequestPermission";


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

	return (
		<>
			<input type="url" name={props.name} defaultValue={props.value}
					onChange={handleChange} />
			<RequestHostPermission host={host} />
		</>);
}


export function HostAllField(props: FieldProps<boolean>) {
	const [value, setValue] = useState(props.value);
	const forceUpdate = useForceUpdate();

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

	const [needsPermission, _error] =
		usePromise(async () => ! await browser.permissions.contains(permissions),
				[forceUpdate]);

	return (
		<>
			<input type="checkbox" checked={value ?? false} onChange={handleChange} />
			<label className="inline ml-2" htmlFor={props.name}>
				{props.schemaEntry.label ?? props.name}
			</label>

			{needsPermission && value && (
				<p>
					<RequestPermission permissions={permissions}
						label="Grant permission to access all websites"
						onResult={onResult} />
				</p>)}
		</>);
}

HostAllField.noParentLabel = true;
