import React from 'react';
import { Widget } from 'Widget';
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
				<Widget child={Search} props={{searchTitle: "DuckDuckGo", searchURL: "https://duckduckgo.com"}} />
				<div className="grid">
					<Widget child={Links} props={{sections: sections}} />
					<Widget child={Notes} props={{localStorageKey: "notes"}} />
					<Widget child={Age} props={{birthDate: new Date("1997-01-01")}} />
					{/* <Widget child={Weather} props={{locationId: "51d45n2d59", locationName:"Bristol"}} /> */}
				</div>
			</main>);
	}
}

export default App;
