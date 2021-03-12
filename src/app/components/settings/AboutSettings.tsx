import { usePromise } from "app/hooks";
import { storage } from "app/Storage";
import { toTypedJSON } from "app/utils/TypedJSON";
import React from "react";

export default function AboutSettings(_props: any) {
	async function handleReset() {
		await storage.clear();
		location.reload();
	}

	async function getStoredData(): Promise<string> {
		return JSON.stringify(toTypedJSON(await storage.getAll()));
	}

	const [data, error] = usePromise(() => getStoredData(), []);

	return (
		<div className="modal-body">
			<h3>About Homescreen</h3>
			<p>
				Welcome to&nbsp;
				<a href="https://homescreen.rubenwardy.com">Homescreen</a>.
				This is a web app and browser extension designed to be used as
				a "New Tab" page in web browsers.
			</p>
			<p>
				Created by <a href="https://rubenwardy.com">rubenwardy</a>.&nbsp;
				<a href="https://gitlab.com/rubenwardy/homescreen/">Open source</a>,
				licensed under GPLv3+.
			</p>
			<p>
				Thanks to <a href="https://unsplash.com">Unsplash</a>,&nbsp;
				<a href="http://openstreetmap.org/">OpenStreetMap</a>,&nbsp;
				<a href="https://openweathermap.org/">OpenWeatherMap</a>, and&nbsp;
				<a href="https://www.rocketlaunch.live/">RocketLaunch.Live</a>
				&nbsp;for their APIs.
			</p>
			<p>
				Consider donating to
				cover costs and help support development.
			</p>
			<p>
				<a className="btn btn-primary"
						href="https://homescreen.rubenwardy.com/donate/">
					Donate
				</a>
			</p>

			<h3 className="mt-4">Help and Requests</h3>
			<p>
				You can get help or request a feature using the link below.
			</p>
			<p>
				<a className="btn btn-primary"
						href="https://homescreen.rubenwardy.com/help/">
					Help and Requests
				</a>
			</p>

			<h3 className="mt-4">Stored data</h3>
			<p>
				Warning: this may contain personal data, if any was entered into
				widget settings.
			</p>
			<textarea readOnly value={data ?? (error && error.toString()) ?? "Loading..."} />
			<p>
				<a className="btn btn-danger" onClick={handleReset}>Reset everything</a>
			</p>
		</div>);
}
