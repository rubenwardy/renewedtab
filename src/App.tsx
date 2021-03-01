import React from 'react';
import { Age, Links } from "./widgets";

interface IClockState {
	date: Date;
}

class Clock extends React.Component<{}, IClockState> {
	private timerID?: NodeJS.Timeout;

	constructor(props: {} | Readonly<{}>) {
		super(props);
		this.state = { date: new Date() };
	}

	componentDidMount(): void {
		this.timerID = setInterval(() => this.tick(), 1000);
	}

	componentWillUnmount() {
		if (this.timerID) {
			clearInterval(this.timerID);
		}
	}

	tick(): void {
		this.setState({
			date: new Date()
		});
	}

	render() {
		return (<h1>{this.state.date.toLocaleTimeString()}</h1>);
	}
}


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
				<Clock />
				<div className="grid">
					<Links sections={sections} />
					<Age birthDate={new Date("1997-01-01")} />
				</div>
			</main>);
	}
}

export default App;
