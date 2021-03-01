import React from 'react';

interface IAgeProps {
	birthDate: Date;
}

interface IAgeState {
	age: number;
}

export class Age extends React.Component<IAgeProps, IAgeState> {
	private timerID?: NodeJS.Timeout;
	private birthDate: Date;

	constructor(props: IAgeProps | Readonly<IAgeProps>) {
		super(props);
		this.birthDate = props.birthDate;
		this.state = { age: this.calculateAge() };
	}

	componentDidMount(): void {
		this.timerID = setInterval(() => this.setState({
			age: this.calculateAge()
		}), 500);
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
		const delta = (new Date().getTime() - this.birthDate.getTime());
		return delta / 365.25 / 1000 / (60 * 60 * 24);
	}
}
