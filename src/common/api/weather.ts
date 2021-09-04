export interface WeatherCurrent {
	icon?: string;
	temp: number;
	feels_like: number;
	pressure: number;
	humidity: number;
	sunrise: string;
	sunset: string;
	uvi: number;
	wind_speed: number;
}

export interface WeatherDay {
	dayOfWeek: number;
	icon?: string,
	minTemp: number;
	maxTemp: number;
	sunrise: string;
	sunset: string;
}

export interface WeatherHour {
	time: string;
	icon?: string;
	temp: number;
}

export interface WeatherInfo {
	timezone_offset: number;
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
	latitude: number;
	longitude: number;
}


export function convertWeatherTemperatures(info: WeatherInfo, unit: TemperatureUnit): WeatherInfo {
	if (typeof unit == "string") {
		unit = TemperatureUnit[unit] as unknown as TemperatureUnit;
	}

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
			feels_like: convert(info.current.feels_like),
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

export function renderSpeed(speed: number, unit: SpeedUnit) {
	if (typeof unit == "string") {
		unit = SpeedUnit[unit] as unknown as SpeedUnit;
	}

	switch (unit) {
	case SpeedUnit.MetersPerSecond:
		return `${speed.toFixed(1)}m/s`;
	case SpeedUnit.MilesPerHour:
		const mph = speed * 2.23694;
		return `${mph.toFixed(1)}mph`;
	case SpeedUnit.KilometersPerHour:
		const kph = speed * 3.6;
		return `${kph.toFixed(1)}kph`;
	default:
		throw new Error(`Unknown unit: ${unit}`);
	}
}
