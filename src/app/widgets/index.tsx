export { default as Age } from "./Age";
export { default as Button } from "./Button";
export { default as Clock } from "./Clock";
export { default as Links } from "./Links";
export { default as IFrame } from "./IFrame";
export { default as Notes } from "./Notes";
export { default as RSS } from "./RSS";
export { default as Search } from "./Search";
export { default as SpaceFlights } from "./SpaceFlights";
export { default as Weather } from "./Weather";

import { WidgetFactory } from "../WidgetManager";
import { Age, Button, Clock, Links, IFrame, Notes, RSS, Search, SpaceFlights, Weather } from ".";

export const WidgetTypes: { [name: string]: WidgetFactory<any> } = {
	Age: Age,
	Button: Button,
	Clock: Clock,
	Links: Links,
	IFrame: IFrame,
	Notes: Notes,
	RSS: RSS,
	Search: Search,
	SpaceFlights: SpaceFlights,
	Weather: Weather
};
