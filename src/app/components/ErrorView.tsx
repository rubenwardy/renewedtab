import { miscMessages } from "app/locale/common";
import React, { Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Sentry from "@sentry/react";
import UserError from "app/utils/UserError";
import { myFormatMessage } from "app/locale/MyMessageDescriptor";

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
				<div className="panel text-muted loading">
					<FormattedMessage {...miscMessages.loading} />
				</div>);
		} else {
			return (<></>);
		}
	}

	let msg: string
	if (typeof props.error == "object") {
		if ("messageDescriptor" in props.error) {
			msg = myFormatMessage(intl, props.error.messageDescriptor!);
		} else if ("message" in props.error) {
			msg = props.error.message;
		} else {
			console.error(props.error);
			throw new Error("Unknown error value!");
		}
	} else {
		msg = props.error;
	}

	return (
		<div className={`${props.panel !== false && "panel"} text-muted error`}>
			<FormattedMessage
					defaultMessage="Error: {msg}"
					values={{ msg: msg }} />
		</div>);
}


export const ErrorBoundary = Sentry.withErrorBoundary(Fragment, {
	fallback: ({error}) => (<ErrorView error={error} />)
});
