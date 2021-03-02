import React from 'react';

interface WeatherProps {
	locationId: string;
	locationName: string;
}

export function Weather(props: WeatherProps) {
	return (
		<div className="panel">
			<a className="weatherwidget-io" href={`https://forecast7.com/en/${props.locationId}/${props.locationName.toLowerCase()}/`}
					data-label_1="BRISTOL" data-font="Roboto" data-days="3" data-textcolor="White">
				{props.locationName}
			</a>
		</div>);
}
