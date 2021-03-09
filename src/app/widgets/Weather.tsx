import React from 'react';
import { useAPI } from 'app/utils/hooks';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { Location, type } from 'app/utils/Schema';


interface WeatherForecastProps {
	day: string;
	icon?: string,
	minTemp: number;
	maxTemp: number;
	sunrise: string;
	sunset: string;
}


function makeIconElement(icon?: string) {
	return icon
		? (<img className="icon" src={`https://openweathermap.org/img/wn/${icon}.png`} />)
		: (<></>);
}


function WeatherForecast(props: WeatherForecastProps) {
	return (
		<div className="forecast">
			<span className="label">{props.day}</span>
			<span>
				{makeIconElement(props.icon)}
				{props.minTemp.toFixed(0)}&deg;C {props.maxTemp.toFixed(0)}&deg;C
			</span>
		</div>);
}


interface WeatherInfo {
	current: { icon?: string, temp: number };
	forecast: WeatherForecastProps[];
}


interface WeatherProps {
	url: string;
	location: Location;
}

export default function Weather(props: WeatherProps) {
	if (!props.location) {
		return (
			<div className="panel text-muted">
				Location needed. Click edit to add it.
			</div>);
	}


	const [info, error] = useAPI<WeatherInfo>("/weather/",
		{ lat: props.location.latitude, long: props.location.longitude},
		[props.location.latitude, props.location.longitude]);

	if (!info) {
		return (
			<div className="panel text-muted">
			{error ? error.toString() : "Loading weather..."}
		</div>);
	}

	const forecast = info.forecast.slice(1, 4).map(forecast => (<WeatherForecast key={forecast.day} {...forecast} />));

	return (
		<div className="panel weather">
			<h2 className="col-span-3"><a href={props.url}>{props.location.name}</a></h2>
			<div className="col-span-3 large">
				{makeIconElement(info.current.icon)}
				{info.current.temp.toFixed(0)} &deg;C
			</div>
			{forecast}
		</div>);
}


Weather.description = "Current and forecasted weather";

Weather.initialProps = {
	url: "https://www.bbc.co.uk/weather/2654675",
	location: {
		locationName: "Bristol",
		latitude: 51.454514,
		longitude: -2.587910,
	},
};


Weather.schema = {
	url: type.url("Link URL"),
	location: type.location("Location"),
} as Schema;

Weather.defaultSize = new Vector2(5, 3);
