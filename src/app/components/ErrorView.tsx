import { miscMessages } from "app/locale/common";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

interface ErrorViewProps {
	/**
	 * The error message
	 */
	error?: string | MessageDescriptor | Error | null;

	/**
	 * Whether to show loading if error is undefined/null
	 * Default: false
	 */
	loading?: boolean;

	/**
	 * Whether or not to show as a panel
	 * Default: true
	 */
	panel?: boolean;
}


export default function ErrorView(props: ErrorViewProps) {
	const intl = useIntl();

	if (props.error == undefined) {
		if (props.loading === true) {
			return (
				<div className="panel text-muted">
					<FormattedMessage {...miscMessages.loading} />
				</div>);
		} else {
			return (<></>);
		}
	}

	let msg = props.error;

	if (typeof msg == "object" && (
			typeof (msg as any).defaultMessage !== "undefined" ||
			typeof (msg as any).id !== "undefined")) {
		msg = intl.formatMessage(msg as MessageDescriptor);
	} else if (msg instanceof Error) {
		msg = msg.toString();
		if (msg.startsWith("Error:")) {
			msg = msg.slice(6);
		}
	}

	return (
		<div className={`${props.panel !== false && "panel"} text-muted`}>
			<FormattedMessage
					defaultMessage="Error: {msg}"
					values={{ msg: msg }} />
		</div>);
}
