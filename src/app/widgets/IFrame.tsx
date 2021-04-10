import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React from 'react';

interface IFrameProps {
	url: string;
}

export default function IFrame(props: WidgetProps<IFrameProps>) {
	return (
		<div className="panel flush">
			<iframe src={props.props.url} width="100%" height="100%" frameBorder="0" />
		</div>);
}


IFrame.description = "Shows a webpage";

IFrame.initialProps = {
	url: "https://example.com"
};

IFrame.schema = {
	url: type.url("URL"),
} as Schema;

IFrame.defaultSize = new Vector2(5, 4);
