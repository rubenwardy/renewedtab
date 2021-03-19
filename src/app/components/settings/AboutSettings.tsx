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
		const data = toTypedJSON(await storage.getAll()) as { [name: string]: any };
		for (let key in data) {
			if (key.startsWith("large-")) {
				data[key] = undefined;
			}
		}

		return JSON.stringify(data);
	}

	const [data, error] = usePromise(() => getStoredData(), []);

	return (
		<div className="modal-body">
			<h3>About Homescreen</h3>
			<p>
				Welcome to&nbsp;
				<a href="https://homescreen.rubenwardy.com">Homescreen</a>:
				A customisable New Tab page for your browser.
			</p>
			<p>
				Created by <a href="https://rubenwardy.com">rubenwardy</a>.&nbsp;
				<a href="https://gitlab.com/rubenwardy/homescreen/">Open source</a>,
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
				Like Homescreen? Consider donating to
				cover costs and help support development.
			</p>
			<p>
				<a className="btn btn-primary"
						href="https://homescreen.rubenwardy.com/">
					<i className="fas fa-globe-europe mr-1" />
					Website
				</a>
				<a className="btn btn-primary"
						href="https://homescreen.rubenwardy.com/donate/">
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
