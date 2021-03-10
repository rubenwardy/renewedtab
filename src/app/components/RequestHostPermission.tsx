import { runPromise } from "app/hooks";
import React, { useState } from "react";

function makePermission(host: string): any {
	return {
		origins: [`*://${host}/*`]
	}
}

export async function needsPermission(host: string): Promise<boolean> {
	if (typeof browser === 'undefined') {
		return false;
	}

	return !(await browser.permissions.contains(makePermission(host)));
}

export async function checkHostPermission(url: string) {
	const host = new URL(url).host;
	if (await needsPermission(host)) {
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

	function handleClick() {
		browser.permissions.request(makePermission(props.host)).then((accepted: boolean) => {
			if (accepted) {
				setVisible(false);
			}
		});
	}

	runPromise(() => needsPermission(props.host),
		setVisible, () => {},
		[props.host]);

	if (isVisible) {
		return (
			<p>
				<a className="link" onClick={() => handleClick()}>
					Grant permission to access {props.host}
				</a>
			</p>);
	} else {
		return null;
	}
}
