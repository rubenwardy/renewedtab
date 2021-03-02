export { default as Age } from "./Age";
export { default as Clock } from "./Clock";
export { default as Links } from "./Links";
export { default as Notes } from "./Notes";
export { default as Search } from "./Search";
export { default as Weather } from "./Weather";

import { Age, Clock, Links, Notes, Search, Weather } from ".";

export const WidgetTypes: { [name: string]: (props: any) => JSX.Element } = {
	Age: Age,
	Clock: Clock,
	Links: Links,
	Notes: Notes,
	Search: Search,
	Weather: Weather
};
