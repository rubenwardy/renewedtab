import UserError from "server/UserError";
import { Response } from "../http";

export interface AccuError {
	Code: number;
	Message: string;
}


export interface AccuLocation {
	Key: string;
	LocalisedName?: string;
	EnglishName?: string;
	GeoPosition: { Latitude: number, Longitude: number };
	Country?: { LocalizedName?: string, EnglishName?: string };
	AdministrativeArea?: { LocalizedName?: string, EnglishName?: string };
}


export interface AccuValue {
	Value: number;
	Unit: string;
	UnitType: number;
}


export interface AccuPartSummary {
	Icon: number;
	IconPhrase: string;
	HasPrecipitation: boolean;
	PrecipitationType?: string;
	PrecipitationIntensity?: string;
	PrecipitationProbability?: number;
	Wind: {
		Speed: AccuValue;
	};
}


export interface AccuTemperatureRange {
	Minimum: AccuValue;
	Maximum: AccuValue;
}


export interface AccuDay {
	Date: string;
	Temperature: AccuTemperatureRange;
	Day: AccuPartSummary;
	Night: AccuPartSummary;
	Sun: {
		Rise?: string;
		Set?: string;
	};
}


export interface AccuHour {
	DateTime: string;
	Temperature: AccuValue;
	WeatherIcon: number;
	IconPhrase: string;
	PrecipitationProbability: number;
}


export interface AccuDailyAPI {
	DailyForecasts: AccuDay[];
}


export type AccuHourlyAPI = AccuHour[];


export interface AccuCurrentAPI {
	LocalObservationDateTime: string;
    WeatherIcon: number;
	Temperature: { Metric: AccuValue; };
	RealFeelTemperature: { Metric: AccuValue; };
	Pressure: { Metric: AccuValue; };
	HasPrecipitation: boolean;
	PrecipitationType?: string;
	PrecipitationIntensity?: string;
	PrecipitationProbability?: number;
	IsDayTime: boolean;
	RelativeHumidity: number;
	UVIndex: number;
	Wind: {
		Speed: { Metric: AccuValue };
	};
	Link: string;
}


export async function handleAccuError(response: Response) {
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) {
		const text = await response.text();
		throw new Error(`Invalid accuweather response: ${text}`);
	}

	const error = await response.json() as AccuError;
	console.log("Failed at ", response.url, ":", error);
	if (error.Message && error.Message.includes("requests has been exceeded")) {
		throw new UserError("Too many requests to Weather API service.");
	} else {
		console.log(error);
		throw new UserError(`Error getting weather, ${response.statusText}.`);
	}
}
