import Schema from 'app/utils/Schema';
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


IFrame.initialProps = {
	url: "https://example.com"
};

IFrame.schema = {
	url: "string",
} as Schema;

IFrame.defaultSize = new Vector2(5, 4);
