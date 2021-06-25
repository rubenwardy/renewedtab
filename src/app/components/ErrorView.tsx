import { miscMessages } from "app/locale/common";
import React, { Fragment } from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";
import * as Sentry from "@sentry/react";
import UserError from "common/UserError";

interface ErrorViewProps {
	/**
	 * The error message
	 */
	error?: string | Error | UserError | null;

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
	if (msg instanceof UserError && msg.messageDescriptor) {
		msg = intl.formatMessage(msg.messageDescriptor);
	} else if (msg instanceof Error) {
		msg = msg.message;
	}

	return (
		<div className={`${props.panel !== false && "panel"} text-muted`}>
			<FormattedMessage
					defaultMessage="Error: {msg}"
					values={{ msg: msg }} />
		</div>);
}


export const ErrorBoundary = Sentry.withErrorBoundary(Fragment, {
	fallback: ({error}) => (<ErrorView error={error} />)
});
