import { WidgetType } from "../Widget";

import Age from "./Age";
import Bookmarks from "./Bookmarks";
import Button from "./Button";
import Clock from "./Clock";
import DailyGoal from "./DailyGoal";
import Feed from "./Feed";
import Greeting from "./Greeting";
import HelpAbout from "./HelpAbout";
import IFrame from "./IFrame";
import Image from "./Image";
import Invisible from "./Invisible";
import Links from "./Links";
import Notes from "./Notes";
import Search from "./Search";
import SpaceFlights from "./SpaceFlights";
import TodoList from "./TodoList";
import TopSites from "./TopSites";
import Weather from "./Weather";
import WebComic from "./WebComic";

export const WidgetTypes: { [name: string]: WidgetType<any> } = {
	Age: Age,
	Button: Button,
	Bookmarks: Bookmarks,
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
	TodoList: TodoList,
	TopSites: TopSites,
	WebComic: WebComic,
	Weather: Weather,
};
