import { runPromise } from "app/hooks";
import { bindValuesToDescriptor } from "app/locale/MyMessageDescriptor";
import UserError from "app/utils/UserError";
import React, { useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import RequestPermission from "./RequestPermission";

const messages = defineMessages({
	hostPermissionNeeded :{
		defaultMessage: "Permission needed to access {host}. Edit this widget to grant it."
	}
})

function makeHostPermission(host: string): browser.permissions.Permissions {
	return {
		origins: [`*://${host}/*`]
	}
}

export async function needsHostPermission(host: string): Promise<boolean> {
	if (typeof browser === 'undefined') {
		return false;
	} else if (host.endsWith(".renewedtab.com")) {
		return false;
	}

	return !(await browser.permissions.contains(makeHostPermission(host)));
}

export async function checkHostPermission( url: string) {
	const host = new URL(url).host;
	if (await needsHostPermission(host)) {
		throw new UserError(bindValuesToDescriptor(messages.hostPermissionNeeded, { host: host }));
	}
}


interface RequestHostPermissionProps {
	host: string;
	onHasPermission?: () => void;
}

export default function RequestHostPermission(props: RequestHostPermissionProps) {
	if (typeof browser === 'undefined') {
		return null;
	}

	const [isVisible, setVisible] = useState<boolean>(false);

	runPromise(() => needsHostPermission(props.host),
		needsPerm => {
			setVisible(needsPerm);
			if (!needsPerm) {
				props.onHasPermission?.();
			}
		}, () => {},
		[props.host]);

	const intl = useIntl();

	if (isVisible) {
		const label = intl.formatMessage(
				{ defaultMessage: "Grant permission to access {host}" },
				{ host: props.host });
		return (
			<p className="my-4">
				<RequestPermission permissions={makeHostPermission(props.host)}
						label={label} onResult={granted => {
							if (granted) {
								setVisible(false);
								props.onHasPermission?.();
							}
						}} />
			</p>);
	} else {
		return null;
	}
}
