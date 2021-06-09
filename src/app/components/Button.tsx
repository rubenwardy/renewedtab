import { MessageDescriptor } from "@formatjs/intl";
import React from "react";
import { FormattedMessage } from "react-intl";


export enum ButtonVariant {
	None,
	Primary,
	Secondary,
	Danger,
	Highlight,
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

	const className = [ "btn" ];
	if (props.small) {
		className.push("btn-sm");
	}

	const variant = props.variant ?? ButtonVariant.Primary;
	const variantName = ButtonVariant[variant]!.toString().toLowerCase();
	className.push(`btn-${variantName}`);
	if (props.active) {
		className.push("active");
	}

	const label = props.label && (props.label.defaultMessage
		? <FormattedMessage {...props.label} />
		: props.label);

	return (
		<Tag {...props} className={className.join(" ") + " " + props.className ?? ""}>
			{props.icon &&
				(<i className={`${props.icon} ${label && "mr-2"}`} />)}
			{label}
		</Tag>);
}
