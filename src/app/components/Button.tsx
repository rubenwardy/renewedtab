import { MessageDescriptor } from "@formatjs/intl";
import { mergeClasses } from "app/utils";
import React from "react";
import { FormattedMessage } from "react-intl";


export enum ButtonVariant {
	None,
	Primary,
	Secondary,
	Danger,
}


interface ButtonProps {
	// Any default button properties.
	[ key: string ]: any;

	small?: boolean;
	variant?: ButtonVariant;
	href?: string;
	active?: boolean;

	icon?: string;
	label?: MessageDescriptor;
}


export default function Button(props: ButtonProps) {
	const Tag = props.href ? "a" : "button";

	const variant = props.variant ?? ButtonVariant.Primary;
	const variantName = ButtonVariant[variant]!.toString().toLowerCase();

	const className = mergeClasses(
			"btn",
			props.small && "btn-sm",
			`btn-${variantName}`,
			props.active && "active",
			props.className);


	const label = props.label && (props.label.defaultMessage
		? <FormattedMessage {...props.label} />
		: props.label);

	const props2 = { ...props };
	delete props2.small;
	delete props2.variant;
	delete props2.active;
	delete props2.icon;
	delete props2.label;
	return (
		<Tag {...props2} className={className}>
			{props.icon &&
				(<i className={`${props.icon} ${label && "mr-2"}`} />)}
			{label}
		</Tag>);
}
