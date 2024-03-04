import React, { useMemo, useRef } from 'react';
import { useElementSize } from 'app/hooks/elementSize';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';
import { WidgetProps, WidgetType } from 'app/Widget';
import { defineMessages, FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import { schemaMessages } from 'app/locale/common';
import Panel from 'app/components/Panel';
import ErrorView from 'app/components/ErrorView';
import { convertWeatherTemperatures, getUVRisk, Location, convertSpeed, SpeedUnit, TemperatureUnit, UVRisk, WeatherCurrent, WeatherDay, WeatherHour, WeatherInfo, getSpeedUnitSuffix } from 'common/api/weather';
import UserError from 'app/utils/UserError';
import { formatNumber, mergeClasses } from 'app/utils';
import FitText from 'app/components/FitText';
import deepCopy from 'app/utils/deepcopy';
import { bindValuesToDescriptor } from "app/locale/MyMessageDescriptor";
import { fetchAPI, usePromise } from "app/hooks";


const messages = defineMessages({
	title: {
		defaultMessage: "Weather",
		description: "Weather Widget",
	},

	description: {
		defaultMessage: "Current and forecasted weather",
		description: "Weather widget description"
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

	humidityTooltip: {
		defaultMessage: "Humidity (%)",
		description: "Weather widget: humidity tooltip",
	},

	precipitationTooltip: {
		defaultMessage: "Precipitation (%)",
		description: "Weather widget: change of precipitation (rain, etc)",
	},

	windTooltip: {
		defaultMessage: "Wind Speed ({unit})",
		description: "Weather widget: wind speed tooltip",
	},

	sunriseTooltip: {
		defaultMessage: "Sunrise - Sunset",
		description: "Weather widget: wind speed tooltip",
	},

	display: {
		defaultMessage: "Display Options",
		description: "Weather widget: display subform title",
	},

	displayHint: {
		defaultMessage: "Even if you hide some info, you can often still see it by hovering over days and hours",
		description: "Weather widget: form field hint (Display Options)",
	},

	showCurrent: {
		defaultMessage: "Show current weather",
		description: "Weather widget: form field label",
	},

	showFeelsLike: {
		defaultMessage: "Current: Show feels like",
		description: "Weather widget: form field label",
	},

	showPrecipitation: {
		defaultMessage: "Current: Show precipitation",
		description: "Weather widget: form field label",
	},

	showHumidity: {
		defaultMessage: "Current: Show humidity",
		description: "Weather widget: form field label",
	},

	showWind: {
		defaultMessage: "Current: Show wind",
		description: "Weather widget: form field label",
	},

	showUV: {
		defaultMessage: "Current: Show UV risk",
		description: "Weather widget: form field label",
	},

	showSunriseSunset: {
		defaultMessage: "Current: Show sunrise / sunset",
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

	askForDonations: {
		defaultMessage: "Find this useful? Consider <a>donating</a> to cover the costs of the weather API, and support future Renewed Tab development.",
		description: "Weather widget: asking for donations",
	}
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
	[0]: { defaultMessage: "SUN", description: "Short weekday name (Sunday)" },
	[1]: { defaultMessage: "MON", description: "Short weekday name (Monday)" },
	[2]: { defaultMessage: "TUE", description: "Short weekday name (Tuesday)" },
	[3]: { defaultMessage: "WED", description: "Short weekday name (Wednesday)" },
	[4]: { defaultMessage: "THU", description: "Short weekday name (Thursday)" },
	[5]: { defaultMessage: "FRI", description: "Short weekday name (Friday)" },
	[6]: { defaultMessage: "SAT", description: "Short weekday name (Saturday)" },
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
				src={`https://openweathermap.org/img/wn/${props.icon}@2x.png`} />)
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


function Day({ day, windSpeedUnit }: { day: WeatherDay, windSpeedUnit: SpeedUnit }) {
	const intl = useIntl();
	const sunriseTooltip = intl.formatMessage(messages.sunriseTooltip);
	const precipitationTooltip = intl.formatMessage(messages.precipitationTooltip);

	const speed = day.wind_speed != undefined && convertSpeed(day.wind_speed, windSpeedUnit);
	const speedUnit = day.wind_speed != undefined && getSpeedUnitSuffix(windSpeedUnit);
	const windTooltip = intl.formatMessage(messages.windTooltip, { unit: speedUnit });

	const tooltip = [
		day.sunrise && day.sunset &&
			`${sunriseTooltip}: ${day.sunrise} - ${day.sunset}`,
		day.precipitation &&
			`${precipitationTooltip}: ${day.precipitation}%`,
		speed &&
			`${windTooltip}: ${speed.toFixed(2)} ${speedUnit}`,
	];

	return (
		<div className="col-auto forecast" title={tooltip.filter(x => x).join("\n")}>
			<div>
				<FormattedMessage {...dayNames[day.dayOfWeek]} />
			</div>
			<div className="row row-centered">
				<div className="col-auto"><Icon icon={day.icon} /></div>
				<div className="col temp">
					<span className="high">{formatNumber(day.maxTemp)}</span>
					{" "}
					<span className="low">{formatNumber(day.minTemp)}</span>
				</div>
			</div>
		</div>);
}


function Hour(props: WeatherHour) {
	const intl = useIntl();
	const precipitationTooltip = intl.formatMessage(messages.precipitationTooltip);
	return (
		<div className="col-auto forecast">
			<div>{renderHour(props.time)}</div>
			<div className="row row-centered">
				<div className="col-auto"><Icon icon={props.icon} /></div>
				<div className="col temp">{formatNumber(props.temp)}</div>
				{(props.precipitation && props.precipitation > 2) ?  (
					<div className="col rain ml-1" title={precipitationTooltip}>
						{props.precipitation.toFixed(0)}%
					</div>) : null}
			</div>
		</div>);
}


function CurrentDetails(props: { current: WeatherCurrent, display: WeatherDisplay, windSpeedUnit: SpeedUnit }) {
	const uvRisk = (props.current.uvi != undefined && props.current.uvi > 0)
		? getUVRisk(props.current.uvi) : undefined;
	const speed = props.current.wind_speed != undefined && convertSpeed(props.current.wind_speed, props.windSpeedUnit);
	const speedUnit = props.current.wind_speed != undefined && getSpeedUnitSuffix(props.windSpeedUnit);

	const intl = useIntl();
	const windTooltip = intl.formatMessage(messages.windTooltip, { unit: speedUnit });
	const precipitationTooltip = intl.formatMessage(messages.precipitationTooltip);
	const humidityTooltip = intl.formatMessage(messages.humidityTooltip);
	const sunriseTooltip = intl.formatMessage(messages.sunriseTooltip);

	return (
		<>
			<div className="pair">
				{props.display.showPrecipitation && props.current.precipitation != undefined && (
					<p key="precipitation" title={precipitationTooltip}>
						<i className="fas fa-umbrella mr-1" />
						<b>{props.current.precipitation}%</b>
					</p>)}
				{props.display.showHumidity && props.current.humidity != undefined && (
					<p key="humidity" title={humidityTooltip}>
						<i className="fas fa-tint mr-1" />
						<b>{props.current.humidity}%</b>
					</p>)}
			</div>

			{props.display.showWind && speed !== false && (
				<p key="wind" title={windTooltip}>
					<i className="fas fa-wind mr-1" />
					<b>{speed.toFixed(1)}</b>
				</p>)}

			{props.display.showUV && uvRisk !== undefined && (
					<p key="uv">
						<FormattedMessage {...uvRiskMessages[uvRisk]}
							values={{
								b: (chunk: any) => (
									<b className={`uv-${UVRisk[uvRisk].toLowerCase()}`}>
										{chunk}
									</b>),
						}}/>
					</p>)}

			{(props.display.showSunriseSunset && props.current.sunrise && props.current.sunset) && (
				<p key="sunrise" title={sunriseTooltip}>
					<i className="fas fa-sun mr-1" />
					<b>{props.current.sunrise} - {props.current.sunset}</b>
				</p>)}
		</>);
}


function Current(props: {
		current: WeatherCurrent, display: WeatherDisplay, windSpeedUnit: SpeedUnit }) {
	return (
		<div className="row weather-current h-100">
			<div className="col h-100">
				<div className="row row-vertical text-left h-100">
					<FitText className="col temp">
						{formatNumber(props.current.temp)}°
					</FitText>
					{props.display.showFeelsLike && props.current.feels_like && (
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
			{hasDetails(props.display) && (
				<div className="col-auto text-left details">
					<CurrentDetails {...props} />
				</div>)}
			<div className="col text-right h-100 icon-container">
				<Icon icon={props.current.icon} />
			</div>
		</div>);
}


interface WeatherDisplay {
	showCurrent: boolean;
	showFeelsLike: boolean;
	showPrecipitation: boolean;
	showHumidity: boolean;
	showWind: boolean;
	showUV: boolean;
	showSunriseSunset: boolean;
	showHourlyForecast: boolean;
	showDailyForecast: boolean;
}


function hasDetails(display: WeatherDisplay) {
	return display.showPrecipitation || display.showHumidity ||
		display.showWind || display.showSunriseSunset;
}

interface WeatherProps {
	location: Location;
	unit: TemperatureUnit
	windSpeedUnit: SpeedUnit;
	display: WeatherDisplay;
}


function getSizeCode(size: Vector2 | undefined, props: WeatherProps) {
	const limitX = hasDetails(props.display) ? 300 : 241;
	let limitY = 0;
	if (props.display.showHourlyForecast && props.display.showDailyForecast) {
		limitY = 310;
	} else if (props.display.showDailyForecast || props.display.showDailyForecast) {
		limitY = 230;
	} else {
		limitY = 115;
	}
	return (size && (size.x < limitX || size.y < limitY)) ? "sm" : "lg";
}


function WeatherImpl({ widget, rawInfo }: { widget: WidgetProps<WeatherProps>, rawInfo: WeatherInfo }) {
	const props = widget.props;
	const unit = props.unit ?? TemperatureUnit.Celsius;
	const ref = useRef(null);
	const size = useElementSize(ref);
	const info = useMemo(() => convertWeatherTemperatures(rawInfo, unit), [rawInfo, unit]);

	const columnWidth = props.display.showHourlyForecast ? 80 : 75;
	const numberOfColumns = size ? size.x / columnWidth : 5;
	const hourly = info.hourly.slice(0, numberOfColumns).map(hour =>
		(<Hour key={hour.time} {...hour} />))

	const daily = info.daily.slice(0, numberOfColumns).map(day =>
		(<Day key={day.dayOfWeek} day={day} windSpeedUnit={props.windSpeedUnit} />));

	const sizeCode = getSizeCode(size, props);
	const hideCredits = size && (size.x < 170 || size.y < 75) && !hasDetails(props.display) &&
			!props.display.showHourlyForecast && !props.display.showDailyForecast;
	const classes = mergeClasses("weather", `weather-${sizeCode}`,
			hideCredits && "weather-by", "h-100");
	return (
		<Panel {...widget.theme} ref={ref}
				className={classes} invisClassName={`${classes} text-shadow`}>
			{!hideCredits && (
				<div className="row">
					<div className="col text-left location weather-title">
						{info.url
							? (<a href={info.url}>{props.location.name}</a>)
							: (props.location.name)}
					</div>
					<div className="col-auto text-right weather-credits">
						<a href="https://www.accuweather.com">
							<img src="accuweather.png" alt="AccuWeather" />
						</a>
					</div>
				</div>)}

			{props.display.showCurrent && (
				<div className="col">
					<Current current={info.current}
						display={props.display}
						windSpeedUnit={props.windSpeedUnit} />
				</div>)}

			{props.display.showHourlyForecast && (
				<div className="row forecasts">{hourly}</div>)}

			{props.display.showDailyForecast && (
				<div className="row forecasts">{daily}</div>)}
		</Panel>);
}


function Weather(widget: WidgetProps<WeatherProps>) {
	const props = widget.props;
	const [rawInfo, error] = usePromise<WeatherInfo>(async () => {
		if (!props.location) {
			throw new UserError(messages.locationNeeded);
		}

		return fetchAPI("/weather/", {
			lat: props.location.latitude.toFixed(2),
			long: props.location.longitude.toFixed(2)
		});
	}, [props.location, props.location?.latitude, props.location?.longitude])

	if (rawInfo) {
		return (<WeatherImpl widget={widget} rawInfo={rawInfo} />);
	} else {
		return (<ErrorView error={error} loading={true} />);
	}
}


const displaySchema: Schema<WeatherDisplay> = {
	showCurrent: type.boolean(messages.showCurrent),
	showFeelsLike: type.boolean(messages.showFeelsLike),
	showPrecipitation: type.boolean(messages.showPrecipitation),
	showHumidity: type.boolean(messages.showHumidity),
	showWind: type.boolean(messages.showWind),
	showUV: type.boolean(messages.showUV),
	showSunriseSunset: type.boolean(messages.showSunriseSunset),
	showHourlyForecast: type.boolean(messages.showHourlyForecast),
	showDailyForecast: type.boolean(messages.showDailyForecast),
};

const initialProps: WeatherProps = {
	location: {
		name: "Bristol",
		latitude: 51.454514,
		longitude: -2.587910,
	} as Location,
	unit: TemperatureUnit.Celsius,
	windSpeedUnit: SpeedUnit.MetersPerSecond,
	display: {
		showCurrent: true,
		showFeelsLike: true,
		showPrecipitation: true,
		showHumidity: true,
		showWind: true,
		showUV: true,
		showSunriseSunset: false,
		showHourlyForecast: false,
		showDailyForecast: true,
	},
};


const widget: WidgetType<WeatherProps> = {
	Component: Weather,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 3),
	initialProps: initialProps,
	editHint: bindValuesToDescriptor(messages.askForDonations, {
		a: (chunk: any) => (<a href="https://renewedtab.com/donate/">{chunk}</a>),
	}),
	schema: {
		location: type.location(schemaMessages.location),
		unit: type.selectEnum(TemperatureUnit, temperatureUnitMessages, messages.temperatureUnit),
		windSpeedUnit: type.selectEnum(SpeedUnit, speedUnitMessages, messages.windSpeedUnit),
		display: type.subform(displaySchema, messages.display, messages.displayHint),
	},

	async onLoaded(widget) {
		widget.props = { ...deepCopy(initialProps), ...widget.props };

		const showDetails = (widget.props.display as any).showDetails
		if (showDetails != undefined) {
			widget.props.display.showFeelsLike = showDetails;
			widget.props.display.showPrecipitation = showDetails;
			widget.props.display.showHumidity = showDetails;
			widget.props.display.showWind = showDetails;
			widget.props.display.showUV = showDetails;
			widget.props.display.showSunriseSunset = false;
			delete (widget.props.display as any).showDetails
		}
	}
};
export default widget;
