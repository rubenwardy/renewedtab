import React from 'react';
import { useAPI } from 'app/hooks';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { type } from 'app/utils/Schema';
import { WidgetProps } from 'app/Widget';
import { defineMessages, FormattedMessage, MessageDescriptor } from 'react-intl';
import { schemaMessages } from 'app/locale/common';
import Panel from 'app/components/Panel';
import ErrorView from 'app/components/ErrorView';
import { Location, TemperatureUnit, WeatherDay, WeatherInfo } from 'common/api/weather';
import UserError from 'app/utils/UserError';


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
}) as { [num: number]: MessageDescriptor };



interface WeatherDayProps extends WeatherDay {
	renderTemp: (celsius: number) => string;
}

function makeIconElement(icon?: string) {
	return icon
		? (<img className="icon" src={`https://openweathermap.org/img/wn/${icon}.png`} />)
		: (<></>);
}


function WeatherDay(props: WeatherDayProps) {
	return (
		<div className="forecast">
			<span className="label">
				<FormattedMessage {...dayNames[props.dayOfWeek]} />
			</span>
			<span>
				{makeIconElement(props.icon)}
				{props.renderTemp(props.minTemp)} {props.renderTemp(props.maxTemp)}
			</span>
		</div>);
}


interface WeatherProps {
	location: Location;
	unit: TemperatureUnit;
}

export default function Weather(widget: WidgetProps<WeatherProps>) {
	const props = widget.props;

	if (!props.location) {
		return (<ErrorView error={new UserError(messages.locationNeeded)} />);
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
		return (<ErrorView error={error} loading={true} />);
	}

	const forecast = info.daily.slice(1, 4).map(day =>
			(<WeatherDay key={day.dayOfWeek} renderTemp={renderTemp} {...day} />));

	return (
		<Panel {...widget.theme} className="weather" invisClassName="weather text-shadow">
			<h2 className="col-span-3">{props.location.name}</h2>
			<div className="col-span-3 large">
				{makeIconElement(info.current.icon)}
				{renderTemp(info.current.temp)}
			</div>
			{forecast}
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
};


Weather.schema = {
	location: type.location(schemaMessages.location),
	unit: type.selectEnum(TemperatureUnit, messages, messages.temperatureUnit),
} as Schema;

Weather.defaultSize = new Vector2(5, 3);
