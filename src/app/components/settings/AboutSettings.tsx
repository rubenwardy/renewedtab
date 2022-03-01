import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import Button from "../Button";


const messages = defineMessages({
	website: {
		defaultMessage: "Website",
		description: "Renewed Tab website",
	},

	donate: {
		defaultMessage: "Donate",
		description: "Renewed Tab donation link",
	},

	community: {
		defaultMessage: "Discord / Matrix chats"
	},

	help_requests: {
		defaultMessage: "Help and Requests",
	},
})


export default function AboutSettings() {
	const intl = useIntl();
	return (
		<div className="modal-body">
			<h3>
				<FormattedMessage defaultMessage="About Renewed Tab" />
			</h3>
			<p>
				<FormattedMessage
					defaultMessage="Welcome to <a>Renewed Tab</a>: a customisable New Tab page, with widgets and beautiful backgrounds."
					values={{
						a: (chunk: any) => (<a href="https://renewedtab.com">{chunk}</a>)
					}} />
			</p>
			<p>
				<FormattedMessage
					defaultMessage="Created by <a>rubenwardy</a>."
					values={{
						a: (chunk: any) => (<a href="https://rubenwardy.com">{chunk}</a>)
					}} />&nbsp;

				<FormattedMessage
					defaultMessage="<a>Open source</a>, licensed under GPLv3+."
					values={{
						a: (chunk: any) => (<a href="https://gitlab.com/renewedtab/renewedtab/">{chunk}</a>)
					}} />
			</p>
			{intl.locale != intl.defaultLocale && (
				<p>
					<FormattedMessage
						id="translation_credits"
						defaultMessage=""
						description="Credit the translators: LANGUAGE translation by YOUR NAME" />
				</p>)}
			<p>
				<FormattedMessage
					defaultMessage="Thanks to Unsplash, AccuWeather, and RocketLaunch.Live for their APIs." />
				&nbsp;
				<FormattedMessage
					defaultMessage="Thanks to Font-Awesome for icons, React for UI, and WebPack for builds." />
			</p>
			<p>
				<FormattedMessage
					defaultMessage="Enjoying Renewed Tab? Consider donating to help cover costs and support its development." />
			</p>
			<p>
				<Button href="https://renewedtab.com/" icon="fas fa-globe-europe"
					label={messages.website} />

				<Button href="https://renewedtab.com/donate/"
					label={messages.donate} />

				<Button href="https://renewedtab.com/community/"
					label={messages.community} />
			</p>

			<h3 className="mt-6">
				<FormattedMessage
					defaultMessage="Help and Requests" />
			</h3>
			<p>
				<FormattedMessage
					defaultMessage="You can get help or request a feature using the link below." />
			</p>
			<p>
				<Button href="https://renewedtab.com/help/"
					label={messages.help_requests} />
			</p>
		</div>);
}
