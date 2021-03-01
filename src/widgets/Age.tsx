import React from 'react';

interface IAgeState {
	age: number;
}

export class Age extends React.Component<{}, IAgeState> {
	private timerID?: NodeJS.Timeout;

	constructor(props: {} | Readonly<{}>) {
		super(props);
		this.state = { age: this.calculateAge() };
	}

	componentDidMount(): void {
		this.timerID = setInterval(() => this.setState({
			age: this.calculateAge()
		}), 1000);
	}

	componentWillUnmount() {
		if (this.timerID) {
			clearInterval(this.timerID);
		}
	}

	render() {
		return (<div className="panel">You are <strong>{this.state.age.toFixed(7)}</strong></div>)
	}

	calculateAge(): number {
		const delta = (new Date().getTime() - new Date("1997-01-01").getTime());
		return delta / 365.25 / 1000 / (60 * 60 * 24);
	}
}
