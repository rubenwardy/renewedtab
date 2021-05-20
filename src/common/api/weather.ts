export interface WeatherForecast {
	day?: string; ///< deprecated, use dayOfWeek instead

	dayOfWeek: number;
	icon?: string,
	minTemp: number;
	maxTemp: number;
	sunrise: string;
	sunset: string;
}

export interface WeatherInfo {
	timezone_offset: number;
	current: { icon?: string, temp: number };
	forecast: WeatherForecast[];
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
