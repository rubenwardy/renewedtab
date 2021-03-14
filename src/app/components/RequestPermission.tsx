import React from "react";

interface RequestPermissionProps {
	label: string;
	permissions: browser.permissions.Permissions;
	onResult: (v: boolean) => void;
}

export default function RequestPermission(props: RequestPermissionProps) {
	if (typeof browser === 'undefined') {
		return null;
	}

	function handleClick() {
		browser.permissions.request(props.permissions)
			.then(props.onResult).catch(console.error);

	}

	return (
		<a className="link" onClick={() => handleClick()}>
			{props.label}
		</a>);
}
