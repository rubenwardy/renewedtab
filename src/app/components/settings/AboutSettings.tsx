import React from "react";
import { FormattedMessage } from "react-intl";


export default function AboutSettings() {
	return (
		<div className="modal-body">
			<h2>
				<FormattedMessage defaultMessage="About Renewed Tab" />
			</h2>
			<p>
				<FormattedMessage
					defaultMessage="Welcome to <a>Renewed Tab</a>: a customisable New Tab page, with widgets and beautiful backgrounds."
					values={{
						a: (chunk: any) => (<a href="https://renewedtab.rubenwardy.com">{chunk}</a>)
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
							a: (chunk: any) => (<a href="https://gitlab.com/rubenwardy/renewedtab/">{chunk}</a>)
						}} />
			</p>
			<p>
				<FormattedMessage
						id="translation_credits"
						defaultMessage=""
						description="Credit the translators: LANGUAGE translation by YOUR NAME" />
			</p>
			<p>
				<FormattedMessage
						defaultMessage="Thanks to Unsplash, OpenStreetMap, OpenWeatherMap, and RocketLaunch.Live for their APIs." />
				&nbsp;
				<FormattedMessage
						defaultMessage="Thanks to Font-Awesome for icons, React for UI, and WebPack for builds." />
			</p>
			<p>
				<FormattedMessage
						defaultMessage="Like Renewed Tab? Consider donating to cover costs and help support development." />
			</p>
			<p>
				<a className="btn btn-primary"
						href="https://renewedtab.rubenwardy.com/">
					<i className="fas fa-globe-europe mr-1" />

					<FormattedMessage
							defaultMessage="Website" />
				</a>
				<a className="btn btn-primary"
						href="https://renewedtab.rubenwardy.com/donate/">
					<FormattedMessage
							defaultMessage="Donate" />
				</a>
				<a className="btn btn-secondary"
						href="https://renewedtab.rubenwardy.com/community/">
					<FormattedMessage
							defaultMessage="Discord / Matrix chats" />
				</a>
			</p>

			<h3 className="mt-4">
				<FormattedMessage
						defaultMessage="Help and Requests" />
			</h3>
			<p>
				<FormattedMessage
						defaultMessage="You can get help or request a feature using the link below." />
			</p>
			<p>
				<a className="btn btn-primary"
						href="https://renewedtab.rubenwardy.com/help/">
					<FormattedMessage
							defaultMessage="Help and Requests" />
				</a>
			</p>
		</div>);
}
