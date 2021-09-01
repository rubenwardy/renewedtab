export interface WeatherCurrent {
	icon?: string;
	temp: number;
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

export interface Location {
	name: string;
	latitude: number;
	longitude: number;
}
