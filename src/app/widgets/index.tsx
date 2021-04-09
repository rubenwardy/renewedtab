export { default as Age } from "./Age";
export { default as Button } from "./Button";
export { default as Clock } from "./Clock";
export { default as DailyGoal } from "./DailyGoal";
export { default as Greeting } from "./Greeting";
export { default as HelpAbout } from "./HelpAbout";
export { default as IFrame } from "./IFrame";
export { default as Image } from "./Image";
export { default as Invisible } from "./Invisible";
export { default as Links } from "./Links";
export { default as Notes } from "./Notes";
export { default as Feed } from "./Feed";
export { default as Search } from "./Search";
export { default as SpaceFlights } from "./SpaceFlights";
export { default as TopSites } from "./TopSites";
export { default as WebComic } from "./WebComic";
export { default as Weather } from "./Weather";

import { WidgetType } from "../Widget";
import { Age, Button, Clock, DailyGoal, Greeting, HelpAbout, IFrame, Image, Invisible,
	Links, Notes, Feed, Search, SpaceFlights, TopSites, WebComic, Weather } from ".";

export const WidgetTypes: { [name: string]: WidgetType<any> } = {
	Age: Age,
	Button: Button,
	Clock: Clock,
	DailyGoal: DailyGoal,
	Greeting: Greeting,
	HelpAbout: HelpAbout,
	IFrame: IFrame,
	Image: Image,
	Invisible: Invisible,
	Links: Links,
	Notes: Notes,
	Feed: Feed,
	Search: Search,
	SpaceFlights: SpaceFlights,
	TopSites: TopSites,
	WebComic: WebComic,
	Weather: Weather,
};
