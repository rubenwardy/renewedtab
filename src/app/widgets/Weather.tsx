import React from 'react';
import { useAPI } from 'app/hooks';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { Location, type } from 'app/utils/Schema';


enum TemperatureUnit {
	Celsius,
	Fahrenheit // :'(
}

interface WeatherForecast {
	day: string;
	icon?: string,
	minTemp: number;
	maxTemp: number;
	sunrise: string;
	sunset: string;
}

interface WeatherForecastProps extends WeatherForecast {
	renderTemp: (celsius: number) => string;
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
				{props.renderTemp(props.minTemp)} {props.renderTemp(props.maxTemp)}
			</span>
		</div>);
}


interface WeatherInfo {
	current: { icon?: string, temp: number };
	forecast: WeatherForecast[];
}


interface WeatherProps {
	url: string;
	location: Location;
	unit: TemperatureUnit;
}

export default function Weather(props: WeatherProps) {
	if (!props.location) {
		return (
			<div className="panel text-muted">
				Location needed. Click edit to add it.
			</div>);
	}

	const unit = props.unit ?? TemperatureUnit.Celsius;
	function renderTemp(celsuis: number): string {
		if (unit == TemperatureUnit.Celsius) {
			return `${celsuis.toFixed(0)}°C`;
		} else {
			const fh = 1.8 * celsuis + 32;
			return `${fh.toFixed(0)}°F`;
		}
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

	const forecast = info.forecast.slice(1, 4).map(forecast =>
			(<WeatherForecast key={forecast.day} renderTemp={renderTemp} {...forecast} />));

	return (
		<div className="panel weather">
			<h2 className="col-span-3">
				<a href={props.url}>{props.location.name}</a>
			</h2>
			<div className="col-span-3 large">
				{makeIconElement(info.current.icon)}
				{renderTemp(info.current.temp)}
			</div>
			{forecast}
		</div>);
}


Weather.description = "Current and forecasted weather";

Weather.editHint = "Powered by OpenWeatherMap.org";

Weather.initialProps = {
	url: "https://www.bbc.co.uk/weather/2654675",
	location: {
		name: "Bristol",
		latitude: 51.454514,
		longitude: -2.587910,
	} as Location,
	unit: TemperatureUnit.Celsius,
};


Weather.schema = {
	url: type.url("Link URL"),
	location: type.location("Location"),
	unit: type.selectEnum(TemperatureUnit, "Temperature Unit"),
} as Schema;

Weather.defaultSize = new Vector2(5, 3);
