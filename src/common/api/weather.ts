import { enumToValue } from "app/utils/enum";

export interface WeatherCurrent {
	icon?: string; // <deprecated

	temp: number;
	feels_like?: number;
	pressure?: number;
	humidity?: number;
	precipitation?: number;
	sunrise?: string;
	sunset?: string;
	uvi?: number;
	wind_speed?: number;
	link?: string;
}

export interface WeatherDay {
	dayOfWeek: number;
	icon?: string, // <deprecated
	minTemp: number;
	maxTemp: number;
	sunrise: string;
	sunset: string;
	precipitation?: number;
	wind_speed?: number;
}

export interface WeatherHour {
	time: string;
	icon?: string; // <deprecated
	precipitation?: number;
	temp: number;
}

export interface WeatherInfo {
	url?: string;

	current: WeatherCurrent;
	hourly: WeatherHour[];
	daily: WeatherDay[];

	forecast?: WeatherDay[];
}

export enum TemperatureUnit {
	Celsius,
	Fahrenheit // :'(
}

export enum SpeedUnit {
	MetersPerSecond,
	MilesPerHour,
	KilometersPerHour,
}

export interface Location {
	name: string;
	key: string;
	latitude: number;
	longitude: number;
}


export function convertWeatherTemperatures(info: WeatherInfo, unit: TemperatureUnit): WeatherInfo {
	unit = enumToValue(TemperatureUnit, unit);

	function convert(temp: number): number {
		if (unit == TemperatureUnit.Fahrenheit) {
			return 1.8 * temp + 32;
		} else {
			return temp;
		}
	}

	return {
		...info,
		current: {
			...info.current,
			temp: convert(info.current.temp),
			feels_like: info.current.feels_like ? convert(info.current.feels_like) : undefined,
		},
		hourly: info.hourly.map(hour => ({
			...hour,
			temp: convert(hour.temp),
		})),
		daily: info.daily.map(day => ({
			...day,
			minTemp: convert(day.minTemp),
			maxTemp: convert(day.maxTemp),
		})),
	};
}


export enum UVRisk {
	Low,
	Moderate,
	High,
	VeryHigh,
	Extreme
}


export function getUVRisk(uvi: number): UVRisk {
	if (uvi < 3) {
		return UVRisk.Low;
	} else if (uvi < 6) {
		return UVRisk.Moderate;
	} else if (uvi < 8) {
		return UVRisk.High;
	} else if (uvi < 11) {
		return UVRisk.VeryHigh;
	} else {
		return UVRisk.Extreme;
	}
}

export function convertSpeed(speed: number, unit: SpeedUnit): number {
	unit = enumToValue(SpeedUnit, unit);

	switch (unit) {
	case SpeedUnit.MetersPerSecond:
		return speed;
	case SpeedUnit.MilesPerHour:
		return speed * 2.23694;
	case SpeedUnit.KilometersPerHour:
		return speed * 3.6;
	default:
		throw new Error(`Unknown unit: ${unit}`);
	}
}

const SpeedUnitSuffixes: Record<SpeedUnit, string> = {
	[SpeedUnit.MetersPerSecond]: "m/s",
	[SpeedUnit.MilesPerHour]: "mph",
	[SpeedUnit.KilometersPerHour]: "kph",
};

export function getSpeedUnitSuffix(unit: SpeedUnit) {
	if (typeof unit == "string") {
		unit = SpeedUnit[unit] as unknown as SpeedUnit;
	}

	return SpeedUnitSuffixes[unit];
}
