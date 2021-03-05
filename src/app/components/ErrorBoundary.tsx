import React from "react";

interface ErrorBoundaryProps {
	children: any;
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
		if (this.state.error) {
			return (
				<div className="panel text-muted">
					An error occured: {this.state.error}
				</div>);
		} else {
			return this.props.children;
		}
	}
}
