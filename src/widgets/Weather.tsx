import React from 'react';
import { Widget } from './Widget';

interface WeatherProps {
	locationId: string;
	locationName: string;
}

export function Weather(props: WeatherProps) {
	return (
		<Widget type="Weather" props={props}>
			<a className="weatherwidget-io" href={`https://forecast7.com/en/${props.locationId}/${props.locationName.toLowerCase()}/`}
					data-label_1="BRISTOL" data-font="Roboto" data-days="3" data-textcolor="White">
				{props.locationName}
			</a>
		</Widget>);
}
