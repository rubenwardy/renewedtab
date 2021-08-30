import React from "react";
import { FormattedMessage, IntlShape, MessageDescriptor } from "react-intl";

export interface MessageWithValue extends MessageDescriptor {
	values?: Record<string, any>;
}

export type MyMessageDescriptor = MessageWithValue | MessageWithValue[];

export function MyFormattedMessage(props: { message: MyMessageDescriptor }) {
	const descriptor = props.message;
	if (Array.isArray(descriptor)) {
		return (<>{descriptor.map(msg => <FormattedMessage key={msg.id} {...msg} />).join(" ")}</>);
	} else {
		return <FormattedMessage {...descriptor} />;
	}
}

export function myFormatMessage(intl: IntlShape, descriptor: MyMessageDescriptor): string {
	if (Array.isArray(descriptor)) {
		return descriptor.map(msg => intl.formatMessage(msg, msg.values)).join(" ");
	} else {
		return intl.formatMessage(descriptor, descriptor.values);
	}
}

export function bindValuesToDescriptor(descriptor: MessageDescriptor, values: Record<string, any>): MyMessageDescriptor {
	return {
		...descriptor,
		values
	}
}
