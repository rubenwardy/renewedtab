import { Vector2 } from 'app/utils/Vector2';
import React from 'react';

interface IFrameProps {
	url: string;
}

export default function IFrame(props: IFrameProps) {
	return (
		<div className="panel flush">
			<iframe src={props.url} width="100%" height="100%" frameBorder="0" />
		</div>);
}


IFrame.defaultProps = {
	url: "https://monitor.rubenwardy.com/d-solo/46olEsqWz/overview?orgId=1&from=1614752790104&to=1614774390104&panelId=123126"
};

IFrame.defaultSize = new Vector2(5, 4);
