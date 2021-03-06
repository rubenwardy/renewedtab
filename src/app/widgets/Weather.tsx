import React from 'react';
import { useJSON } from 'app/utils/hooks';


interface WeatherForecastProps {
	day: string;
	icon: string,
	minTemp: number;
	maxTemp: number;
	sunrise: string;
	sunset: string;
}

function WeatherForecast(props: WeatherForecastProps) {
	return (
		<div className="forecast">
			<span className="label">{props.day}</span>
			<span>
				{props.minTemp}&deg;C {props.maxTemp}&deg;C
			</span>
		</div>);
}


interface WeatherInfo {
	current: { icon: string, temp: number };
	forecast: WeatherForecastProps[];
}

interface WeatherProps {
	url: string;
	locationId: string;
	locationName: string;
}

export default function Weather(props: WeatherProps) {
	const [info, error] = useJSON<WeatherInfo>(
		`https://forecast7.com/en/${props.locationId}/${props.locationName.toLowerCase()}/?format=json`,
		[props.locationId, props.locationName]);

	if (!info) {
		return (
			<div className="panel text-muted">
				{error ? error.toString() : "Loading weather..."}
			</div>);
	}

	const forecast = info.forecast.slice(1, 4).map(forecast => (<WeatherForecast key={forecast.day} {...forecast} />));

	return (
		<div className="panel weather">
			<h2 className="col-span-3"><a href={props.url}>{props.locationName}</a></h2>
			<div className="col-span-3 large">{info.current.temp} &deg;C</div>
			{forecast}
		</div>);
}


Weather.defaultProps = {
	url: "https://www.bbc.co.uk/weather/2654675",
	locationId: "51d45n2d59",
	locationName:"Bristol"
};

Weather.defaultSize = { x: 5, y: 3 };
