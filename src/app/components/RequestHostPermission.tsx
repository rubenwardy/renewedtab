import { runPromise } from "app/hooks";
import React, { useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import RequestPermission from "./RequestPermission";

function makeHostPermission(host: string): any {
	return {
		origins: [`*://${host}/*`]
	}
}

export async function needsHostPermission(host: string): Promise<boolean> {
	if (typeof browser === 'undefined') {
		return false;
	}

	return !(await browser.permissions.contains(makeHostPermission(host)));
}

export async function checkHostPermission(intl: IntlShape, url: string) {
	const host = new URL(url).host;
	if (await needsHostPermission(host)) {
		throw intl.formatMessage({
			defaultMessage: "Permission needed to access {host}. Edit this widget to grant it."
		}, { host: host });
	}
}


interface RequestHostPermissionProps {
	host: string;
}

export default function RequestHostPermission(props: RequestHostPermissionProps) {
	if (typeof browser === 'undefined') {
		return null;
	}

	const [isVisible, setVisible] = useState<boolean>(false);

	runPromise(() => needsHostPermission(props.host),
		setVisible, () => {},
		[props.host]);

	const intl = useIntl();

	if (isVisible) {
		const label = intl.formatMessage(
				{ defaultMessage: "Grant permission to access {host}" },
				{ host: props.host });
		return (
			<p>
				<RequestPermission permissions={makeHostPermission(props.host)}
						label={label} onResult={() => setVisible(false)} />
			</p>);
	} else {
		return null;
	}
}
