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


class App extends React.Component {
	render() {
		return (
			<main>
				<Clock />
				<div className="grid">
					<Links />
					<Age birthDate={new Date("1997-01-01")} />
				</div>
			</main>);
	}
}

export default App;
