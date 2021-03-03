export { default as Age } from "./Age";
export { default as Clock } from "./Clock";
export { default as Links } from "./Links";
export { default as IFrame } from "./IFrame";
export { default as Notes } from "./Notes";
export { default as RSS } from "./RSS";
export { default as Search } from "./Search";
export { default as Weather } from "./Weather";

import { WidgetFactory } from "../WidgetManager";
import { Age, Clock, Links, IFrame, Notes, RSS, Search, Weather } from ".";

export const WidgetTypes: { [name: string]: WidgetFactory<any> } = {
	Age: Age,
	Clock: Clock,
	Links: Links,
	IFrame: IFrame,
	Notes: Notes,
	RSS: RSS,
	Search: Search,
	Weather: Weather
};
