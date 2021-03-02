import React from 'react';
import { Age, Clock, Links, Notes, Search, Weather } from "./widgets";

const sections = [
	{
		title: "Minetest",
		links: [
			{
				"title": "ContentDB Audit Log",
				"url": "https://content.minetest.net/admin/audit/"
			},
			{
				"title": "GitHub",
				"url": "https://github.com/notifications"
			},
			{
				"title": "CTF Monitor",
				"url": "https://monitor.rubenwardy.com/d/9TgIegyGk/ctf"
			},
		]
	},
	{
		title: "Interesting reads",
		links: [
			{
				"title": "UX StackExchange",
				"url": "https://ux.stackexchange.com"
			},
			{
				"title": "UX Collective",
				"url": "https://uxdesign.cc/"
			}
		]
	}
];


class App extends React.Component {
	render() {
		return (
			<main>
				<Clock showSeconds={false} />
				<Search searchEngine="https://duckduckgo.com" />
				<div className="grid">
					<Links sections={sections} />
					<Notes localStorageKey="notes" />
					<Age birthDate={new Date("1997-01-01")} />
					<Weather locationId="51d45n2d59" locationName="Bristol" />
				</div>
			</main>);
	}
}

export default App;
