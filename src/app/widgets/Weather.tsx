import React, { useMemo } from 'react';
import { useAPI, useElementSize } from 'app/hooks';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';
import { Widget, WidgetProps } from 'app/Widget';
import { defineMessages, FormattedMessage, MessageDescriptor } from 'react-intl';
import { schemaMessages } from 'app/locale/common';
import Panel from 'app/components/Panel';
import ErrorView from 'app/components/ErrorView';
import { convertWeatherTemperatures, getUVRisk, Location, convertSpeed, SpeedUnit, TemperatureUnit, UVRisk, WeatherCurrent, WeatherDay, WeatherHour, WeatherInfo, getSpeedUnitSuffix } from 'common/api/weather';
import UserError from 'app/utils/UserError';
import { mergeClasses } from 'app/utils';
import FitText from 'app/components/FitText';
import deepCopy from 'app/utils/deepcopy';


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

	windSpeedUnit: {
		defaultMessage: "Wind Speed Unit",
		description: "Weather widget: form field label",
	},

	display: {
		defaultMessage: "Display Options",
		description: "Weather widget: display subform title",
	},

	showCurrent: {
		defaultMessage: "Show current weather",
		description: "Weather widget: form field label",
	},

	showDetails: {
		defaultMessage: "Show current weather information",
		description: "Weather widget: form field label",
	},

	useDetailsIcons: {
		defaultMessage: "Use icons for details",
		description: "Weather widget: form field label"
	},

	showHourlyForecast: {
		defaultMessage: "Show hourly forecast",
		description: "Weather widget: form field label",
	},

	showDailyForecast: {
		defaultMessage: "Show daily forecast",
		description: "Weather widget: form field label",
	},
});

const temperatureUnitMessages = defineMessages({
	[TemperatureUnit.Celsius]: {
		defaultMessage: "Celsius",
		description: "Weather widget: Celsius unit",
	},

	[TemperatureUnit.Fahrenheit]: {
		defaultMessage: "Fahrenheit",
		description: "Weather widget: Fahrenheit unit",
	},
});

const speedUnitMessages = defineMessages({
	[SpeedUnit.MetersPerSecond]: {
		defaultMessage: "Meters per second (m/s)",
		description: "Weather widget: Speed unit",
	},

	[SpeedUnit.MilesPerHour]: {
		defaultMessage: "Miles per hour (mph)",
		description: "Weather widget: Speed unit",
	},

	[SpeedUnit.KilometersPerHour]: {
		defaultMessage: "Kilometers per hour (kph)",
		description: "Weather widget: Speed unit",
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


const uvRiskMessages = defineMessages({
	[UVRisk.Low]: {
		defaultMessage: "<b>Low</b> UV",
		description: "Low UV risk",
	},

	[UVRisk.Moderate]: {
		defaultMessage: "<b>Moderate</b> UV",
		description: "Moderate UV risk",
	},

	[UVRisk.High]: {
		defaultMessage: "<b>High</b> UV",
		description: "High UV risk",
	},

	[UVRisk.VeryHigh]: {
		defaultMessage: "<b>Very High</b> UV",
		description: "Very High UV risk",
	},

	[UVRisk.Extreme]: {
		defaultMessage: "<b>Extreme</b> UV",
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


function CurrentDetails(props: {
		current: WeatherCurrent, windSpeedUnit: SpeedUnit, showAsIcons: boolean }) {
	const uvRisk = (props.current.uvi != undefined && props.current.uvi > 0)
		? getUVRisk(props.current.uvi) : undefined;
	const speed = props.current.wind_speed != undefined && convertSpeed(props.current.wind_speed, props.windSpeedUnit);
	const speedUnit = props.current.wind_speed != undefined && getSpeedUnitSuffix(props.windSpeedUnit);

	if (props.showAsIcons) {
		return (
			<>
				<div className="pair">
					{speed !== false && (
						<p key="wind" title={speedUnit || undefined}>
							<i className="fas fa-wind mr-1" />
							<b>{speed.toFixed(1)}</b>
						</p>)}
					{props.current.humidity != undefined && (
						<p key="humidity">
							<i className="fas fa-tint mr-1" />
							<b>{props.current.humidity}%</b>
						</p>)}
				</div>
				{uvRisk !== undefined && (
					<p key="uv">
						<FormattedMessage {...uvRiskMessages[uvRisk]}
							values={{
								b: (chunk: any) => (
									<b className={`uv-${UVRisk[uvRisk].toLowerCase()}`}>
										{chunk}
									</b>),
							}}/>
					</p>)}
				{(props.current.sunrise && props.current.sunset) && (
					<p key="sunrise">
						<i className="fas fa-sun mr-1" />
						<b>{props.current.sunrise} - {props.current.sunset}</b>
					</p>)}
			</>);
	} else {
		return (<>
			{speed != false && (
				<p key="wind">
					<FormattedMessage
						defaultMessage="<b>{speed}</b> wind"
						description="Weather widget: wind speed value"
						values={{
							speed: `${speed.toFixed(1)}${speedUnit}`,
							b: (chunk: any) => (<b>{chunk}</b>),
						}} />
				</p>)}
			{props.current.humidity != undefined && (
				<p key="humidity">
					<FormattedMessage
						defaultMessage="<b>{humidity}%</b> humidity"
						description="Weather widget: humidity value"
						values={{
							humidity: props.current.humidity.toFixed(0),
							b: (chunk: any) => (<b>{chunk}</b>),
						}} />
				</p>)}
			{uvRisk != undefined && (
				<p key="uv">
					<FormattedMessage {...uvRiskMessages[uvRisk]}
						values={{
							b: (chunk: any) => (
								<b className={`uv-${UVRisk[uvRisk].toLowerCase()}`}>
									{chunk}
								</b>),
						}}/>
				</p>)}
			{(props.current.sunrise && props.current.sunset) && (
				<p key="sunrise">
					<b>{props.current.sunrise} - {props.current.sunset}</b>
				</p>)}
		</>);
	}
}


function Current(props: {
		current: WeatherCurrent, showDetails: boolean, showAsIcons: boolean, windSpeedUnit: SpeedUnit }) {
	return (
		<div className="row weather-current h-100">
			<div className="col h-100">
				<div className="row row-vertical text-left h-100">
					<FitText className="col temp">{props.current.temp.toFixed(0)}°</FitText>
					{props.showDetails && props.current.feels_like && (
						<div className="col-auto">
							<p className="mx-0">
								<FormattedMessage
									defaultMessage="Feels like <b>{temp}°</b>"
									values={{
										temp: props.current.feels_like.toFixed(0),
										b: (chunk: any) => (<b>{chunk}</b>),
									}} />
							</p>
						</div>)}
				</div>
			</div>
			{props.showDetails && (
				<div className="col-auto text-left details">
					<CurrentDetails {...props} />
				</div>)}
			<div className="col text-right h-100">
				<Icon icon={props.current.icon} />
			</div>
		</div>);
}


interface WeatherDisplay {
	showCurrent: boolean;
	showDetails: boolean;
	showHourlyForecast: boolean;
	showDailyForecast: boolean;
	useDetailsIcons: boolean;
}

interface WeatherProps {
	location: Location;
	unit: TemperatureUnit
	windSpeedUnit: SpeedUnit;
	display: WeatherDisplay;
}


function getSizeCode(size: Vector2 | undefined, props: WeatherProps) {
	const limitX = props.display.showDetails ? 369 : 241;
	let limitY = 0;
	if (props.display.showHourlyForecast && props.display.showDailyForecast) {
		limitY = 310;
	} else if (props.display.showDailyForecast || props.display.showDailyForecast) {
		limitY = 230;
	} else {
		limitY = 115;
	}
	return (size && (size.x <= limitX || size.y <= limitY)) ? "sm" : "lg";
}


export default function Weather(widget: WidgetProps<WeatherProps>) {
	const props = widget.props;
	const unit = props.unit ?? TemperatureUnit.Celsius;
	const [ref, size] = useElementSize<HTMLDivElement>();

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

	const numberOfColumns =  size ? size.x / 65 : 5;
	const hourly = info.hourly.slice(0, numberOfColumns).map(hour =>
		(<Hour key={hour.time} {...hour} />))

	const dailyStartOffset = props.display.showCurrent ? 1 : 0;
	const daily = info.daily.slice(dailyStartOffset, dailyStartOffset + numberOfColumns).map(day =>
			(<Day key={day.dayOfWeek} {...day} />));

	const sizeCode = getSizeCode(size, props);
	const classes = mergeClasses("weather", `weather-${sizeCode}`, "h-100");
	return (
		<Panel {...widget.theme} ref={ref}
				className={classes} invisClassName={`${classes} text-shadow`}>
			<div className="row">
				<div className="col text-left location">
					{props.location.name}
				</div>
				<div className="col-auto text-right weather-credits">
					<a href="https://openweathermap.org">OpenWeatherMap</a>
				</div>
			</div>

			{props.display.showCurrent && (
				<div className="col">
					<Current current={info.current}
						showDetails={props.display.showDetails}
						windSpeedUnit={props.windSpeedUnit}
						showAsIcons={props.display.useDetailsIcons} />
				</div>)}

			{props.display.showHourlyForecast && (
				<div className="row forecasts">{hourly}</div>)}

			{props.display.showDailyForecast && (
				<div className="row forecasts">{daily}</div>)}
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
	windSpeedUnit: SpeedUnit.MetersPerSecond,
	display: {
		showCurrent: true,
		showDetails: true,
		useDetailsIcons: true,
		showHourlyForecast: false,
		showDailyForecast: true,
	}
} as WeatherProps;


const displaySchema: Schema = {
	showCurrent: type.boolean(messages.showCurrent),
	showDetails: type.boolean(messages.showDetails),
	useDetailsIcons: type.boolean(messages.useDetailsIcons),
	showHourlyForecast: type.boolean(messages.showHourlyForecast),
	showDailyForecast: type.boolean(messages.showDailyForecast),
};

Weather.schema = {
	location: type.location(schemaMessages.location),
	unit: type.selectEnum(TemperatureUnit, temperatureUnitMessages, messages.temperatureUnit),
	windSpeedUnit: type.selectEnum(SpeedUnit, speedUnitMessages, messages.windSpeedUnit),
	display: type.subform(displaySchema, messages.display),
} as Schema;

Weather.defaultSize = new Vector2(5, 3);

Weather.onLoaded = async (widget: Widget<WeatherProps>) => {
	widget.props = { ...deepCopy(Weather.initialProps), ...widget.props };
};
