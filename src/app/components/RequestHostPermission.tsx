import { runPromise } from "app/hooks";
import React, { useState } from "react";
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

export async function checkHostPermission(url: string) {
	const host = new URL(url).host;
	if (await needsHostPermission(host)) {
		throw `Permission needed to access ${host}. Edit this widget to grant it.`;
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

	if (isVisible) {
		return (
			<p>
				<RequestPermission permissions={makeHostPermission(props.host)}
						label={`Grant permission to access ${props.host}`}
						onResult={() => setVisible(false)} />
			</p>);
	} else {
		return null;
	}
}
