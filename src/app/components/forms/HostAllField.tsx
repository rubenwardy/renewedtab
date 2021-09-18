import { useForceUpdate, useForceUpdateValue, usePromise } from "app/hooks";
import { myFormatMessage } from "app/locale/MyMessageDescriptor";
import { clearWebsiteIcons } from "app/WebsiteIcon";
import React, { ChangeEvent, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { FieldProps } from ".";
import RequestPermission from "../RequestPermission";

const messages = defineMessages({
    grantAll: {
		defaultMessage: "Grant permission to access all websites",
	},
});


export default function HostAllField(props: FieldProps<boolean>) {
	const [value, setValue] = useState(props.value);
	const [force, forceUpdate] = useForceUpdateValue();
	const intl = useIntl();

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setValue(e.target.checked);
		props.onChange(e.target.checked);
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
				[force]);

	return (
		<>
			<input type="checkbox" checked={value ?? false} onChange={handleChange} />
			<label className="inline ml-2" htmlFor={props.name}>
				{myFormatMessage(intl, props.schemaEntry.label)}
			</label>

			{needsPermission && value && (
				<p className="mt-2">
					<RequestPermission permissions={permissions}
						label={intl.formatMessage(messages.grantAll)}
						onResult={onResult} />
				</p>)}
		</>);
}

HostAllField.noParentLabel = true;
