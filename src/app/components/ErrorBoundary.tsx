import React from "react";

interface ErrorBoundaryProps {
	children: any;
	errorChild?: (props: { error: string }) => JSX.Element;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, { error?: string }> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { error: undefined };
	}

	static getDerivedStateFromError(error: any) {
		return { error: error.toString() };
	}

	render() {
		if (!this.state.error) {
			return this.props.children;
		} else if (this.props.errorChild) {
			const Child = this.props.errorChild;
			return (<Child error={this.state.error} />);
		} else {
			return (
				<div className="panel text-muted">
					An error occured: {this.state.error}
				</div>);
		}
	}
}
