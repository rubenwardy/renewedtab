import React from "react";

export default function AboutSettings(_props: any) {
	return (
		<div className="modal-body">
			<h3>About Renewed Tab</h3>
			<p>
				Welcome to&nbsp;
				<a href="https://renewedtab.rubenwardy.com">Renewed Tab</a>:
				A customisable New Tab page for your browser.
			</p>
			<p>
				Created by <a href="https://rubenwardy.com">rubenwardy</a>.&nbsp;
				<a href="https://gitlab.com/rubenwardy/renewedtab/">Open source</a>,
				licensed under GPLv3+.
			</p>
			<p>
				Thanks to <a href="https://unsplash.com">Unsplash</a>,&nbsp;
				<a href="https://openstreetmap.org/">OpenStreetMap</a>,&nbsp;
				<a href="https://openweathermap.org/">OpenWeatherMap</a>, and&nbsp;
				<a href="https://www.rocketlaunch.live/">RocketLaunch.Live</a>
				&nbsp;for their APIs. Thanks to Font-Awesome for icons,
				React for UI, and WebPack for builds.
			</p>
			<p>
				Like Renewed Tab? Consider donating to
				cover costs and help support development.
			</p>
			<p>
				<a className="btn btn-primary"
						href="https://renewedtab.rubenwardy.com/">
					<i className="fas fa-globe-europe mr-1" />
					Website
				</a>
				<a className="btn btn-primary"
						href="https://renewedtab.rubenwardy.com/donate/">
					Donate
				</a>
				<a className="btn btn-secondary"
						href="https://discord.gg/zYjR54b">
					Discord Server
				</a>
			</p>

			<h3 className="mt-4">Help and Requests</h3>
			<p>
				You can get help or request a feature using the link below.
			</p>
			<p>
				<a className="btn btn-primary"
						href="https://renewedtab.rubenwardy.com/help/">
					Help and Requests
				</a>
			</p>
		</div>);
}
