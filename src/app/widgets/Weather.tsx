import React, { useMemo } from 'react';
import { useAPI } from 'app/hooks';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';
import { WidgetProps } from 'app/Widget';
import { defineMessage, defineMessages, FormattedMessage, MessageDescriptor } from 'react-intl';
import { schemaMessages } from 'app/locale/common';
import Panel from 'app/components/Panel';
import ErrorView from 'app/components/ErrorView';
import { convertWeatherTemperatures, getUVRisk, Location, TemperatureUnit, UVRisk, WeatherCurrent, WeatherDay, WeatherHour, WeatherInfo } from 'common/api/weather';
import UserError from 'app/utils/UserError';
import { mergeClasses } from 'app/utils';


const messages = defineMessages({
	title: {
		defaultMessage: "Weather",
		description: "Weather Widget",
	},

	description: {
		defaultMessage: "Current and forecasted weather",
		description: "Weather widget description"
	},

	editHint: {
		defaultMessage: "Powered by OpenWeatherMap.org",
		description: "Weather widget: edit modal hint",
	},

	locationNeeded: {
		defaultMessage: "Location needed. Click edit to add it.",
		description: "Weather widget: location needed error",
	},

	temperatureUnit: {
		defaultMessage: "Temperature Unit",
		description: "Weather widget: form field label",
	},

	showCurrent: {
		defaultMessage: "Show current weather",
		description: "Weather widget: form field label",
	},

	showDetails: {
		defaultMessage: "Show current weather information",
		description: "Weather widget: form field label",
	},

	showHourlyForecast: {
		defaultMessage: "Show hourly forecast",
		description: "Weather widget: form field label",
	},

	showDailyForecast: {
		defaultMessage: "Show daily forecast",
		description: "Weather widget: form field label",
	},

	[TemperatureUnit.Celsius]: {
		defaultMessage: "Celsius",
		description: "Weather widget: Celsius unit",
	},

	[TemperatureUnit.Fahrenheit]: {
		defaultMessage: "Fahrenheit",
		description: "Weather widget: Fahrenheit unit",
	},
});


const dayNames = defineMessages({
	[0]: { defaultMessage: "Sunday" },
	[1]: { defaultMessage: "Monday" },
	[2]: { defaultMessage: "Tuesday" },
	[3]: { defaultMessage: "Wednesday" },
	[4]: { defaultMessage: "Thursday" },
	[5]: { defaultMessage: "Friday" },
	[6]: { defaultMessage: "Saturday" },
}) as Record<number, MessageDescriptor>;


const uvRisks = defineMessages({
	[UVRisk.Low]: {
		defaultMessage: "Low",
		description: "Low UV risk",
	},

	[UVRisk.Moderate]: {
		defaultMessage: "Moderate",
		description: "Moderate UV risk",
	},

	[UVRisk.High]: {
		defaultMessage: "High",
		description: "High UV risk",
	},

	[UVRisk.VeryHigh]: {
		defaultMessage: "Very High",
		description: "Very High UV risk",
	},

	[UVRisk.Extreme]: {
		defaultMessage: "Extreme",
		description: "Extreme UV risk",
	},
}) as Record<UVRisk, MessageDescriptor>;


function Icon(props: { icon?: string, className?: string }) {
	return props.icon
		? (<img className={mergeClasses("icon", props.className)}
				src={`https://openweathermap.org/img/wn/${props.icon}.png`} />)
		: (<></>);
}


function renderHour(time: string) {
	const hour = parseInt(time.split(":")[0]);
	if (hour == 0) {
		return "12 PM";
	} else if (hour < 12) {
		return `${hour} AM`;
	} else {
		return `${hour - 12} PM`;
	}
}


function Day(props: WeatherDay) {
	return (
		<div className="col-auto forecast">
			<div>
				<FormattedMessage {...dayNames[props.dayOfWeek]} />
			</div>
			<div><Icon icon={props.icon} /></div>
			<div className="temp">
				{props.minTemp.toFixed(0)}° {props.maxTemp.toFixed(0)}°
			</div>
		</div>);
}


function Hour(props: WeatherHour) {
	return (
		<div className="col-auto forecast">
			<div>{renderHour(props.time)}</div>
			<div><Icon icon={props.icon} /></div>
			<div className="temp">{props.temp.toFixed(0)}°</div>
		</div>);
}


function Current(props: { current: WeatherCurrent, showDetails: boolean }) {
	const uvRisk = getUVRisk(props.current.uvi);
	return (
		<div className="row weather-current">
			<div className="col-auto text-left">
				<div className="temp">{props.current.temp.toFixed(0)}°</div>
				{props.showDetails && (
					<p>
						<FormattedMessage
							defaultMessage="Feels like <b>{temp}°</b>"
							values={{
								temp: props.current.feels_like.toFixed(0),
								b: (chunk: any) => (<b>{chunk}</b>),
							}} />
					</p>)}
			</div>
			{props.showDetails && (
				<div className="col-auto text-left">
					<p><b>{props.current.wind_speed.toFixed(1)}m/s</b> wind</p>
					<p><b>{props.current.humidity}%</b> humidity</p>
					{/* <p><b>{props.current.pressure}hPa</b> pressure</p> */}
					<p>
						<b className={`uv-${UVRisk[uvRisk].toLowerCase()}`}>
							<FormattedMessage {...uvRisks[uvRisk]} />
						</b> UV
					</p>
					<p>
						<b>{props.current.sunrise} - {props.current.sunset}</b>
					</p>
				</div>)}
			<div className="col-auto">
				<Icon icon={props.current.icon} />
			</div>
		</div>);
}


interface WeatherProps {
	location: Location;
	unit: TemperatureUnit;
	showCurrent: boolean;
	showDetails: boolean;
	showHourlyForecast: boolean;
	showDailyForecast: boolean;
}

export default function Weather(widget: WidgetProps<WeatherProps>) {
	const props = widget.props;
	const unit = props.unit ?? TemperatureUnit.Celsius;

	if (!props.location) {
		return (<ErrorView error={new UserError(messages.locationNeeded)} />);
	}

	const [rawInfo, error] = useAPI<WeatherInfo>("/weather/",
		{ lat: props.location.latitude, long: props.location.longitude},
		[props.location.latitude, props.location.longitude]);
	if (!rawInfo) {
		useMemo(() => 0, [null, unit])
		return (<ErrorView error={error} loading={true} />);
	}

	const info = useMemo(() => convertWeatherTemperatures(rawInfo, unit), [rawInfo, unit]);


	const hourly = info.hourly.slice(0, 5).map(hour =>
		(<Hour key={hour.time} {...hour} />))

	const dailyStartOffset = props.showCurrent ? 1 : 0;
	const daily = info.daily.slice(dailyStartOffset, dailyStartOffset + 4).map(day =>
			(<Day key={day.dayOfWeek} {...day} />));

	return (
		<Panel {...widget.theme} className="weather" invisClassName="weather text-shadow">
			<div className="row">
				<div className="col text-left location">
					{props.location.name}
				</div>
				<div className="col-auto text-right weather-credits">
					<a href="https://openweathermap.org">OpenWeatherMap</a>
				</div>
			</div>

			{props.showCurrent && (
				<Current current={info.current} showDetails={props.showDetails} />)}

			{props.showHourlyForecast && (
				<div className="row">{hourly}</div>)}

			{props.showDailyForecast && (
				<div className="row">{daily}</div>)}
		</Panel>);
}


Weather.title = messages.title;
Weather.description = messages.description;

Weather.editHint = messages.editHint;

Weather.initialProps = {
	location: {
		name: "Bristol",
		latitude: 51.454514,
		longitude: -2.587910,
	} as Location,
	unit: TemperatureUnit.Celsius,
	showCurrent: true,
	showDetails: true,
	showHourlyForecast: false,
	showDailyForecast: true,
} as WeatherProps;


Weather.schema = {
	location: type.location(schemaMessages.location),
	unit: type.selectEnum(TemperatureUnit, messages, messages.temperatureUnit),
	showCurrent: type.boolean(messages.showCurrent),
	showDetails: type.boolean(messages.showDetails),
	showHourlyForecast: type.boolean(messages.showHourlyForecast),
	showDailyForecast: type.boolean(messages.showDailyForecast),
} as Schema;

Weather.defaultSize = new Vector2(5, 4);
