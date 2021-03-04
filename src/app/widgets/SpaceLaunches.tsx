import React from 'react';
import { useJSON } from 'app/utils/hooks';

interface SpaceLaunch {
	id: number;
	name: string;
	slug: string;
	provider: { name: string };
	vehicle: { name: string };
	win_open: string | null;
	win_close: string | null;
	date_str: string;
}

function getOrdinal(num: number): string {
	const dec = (num / 10) % 10
	const unit = num % 10;
	if (dec == 1) {
		return "th";
	} else if (unit == 1) {
		return "st";
	} else if (unit == 2) {
		return "nd";
	} else if (unit == 3) {
		return "rd";
	} else {
		return "th";
	}
}

function getDate(launch: SpaceLaunch): string {
	const ret = launch.date_str.match(RegExp(/([A-Za-z]+) ([0-9]{2,3})$/));
	if (ret) {
		const day = Number.parseInt(ret[2]);
		const month = ret[1];
		return `${day + getOrdinal(day)} ${month}`;
	} else {
		return launch.date_str;
	}
}


export default function SpaceLaunches(_props: any) {
	const [data, error] = useJSON<{ response: {result: SpaceLaunch[] }}>("https://fdo.rocketlaunch.live/json/launches/next/5", []);

	if (!data) {
		return (
			<div className="panel text-muted">
				{error ? error.toString() : "Loading flights..."}
			</div>);
	}

	const rows = data.response.result.map(launch => (
		<li key={launch.id}>
			<a href={`https://rocketlaunch.live/launch/${launch.slug}`}>
				{launch.name}<br />
				<span className="text-muted">{launch.provider.name}</span>
				<span className="float-right text-muted">{getDate(launch)}</span>
			</a>
		</li>));

	return (
		<div className="panel flush">
			<h2 className="panel-inset">Space Flights</h2>
			<ul className="scrolling">
				{rows}
			</ul>
		</div>);
}

SpaceLaunches.defaultProps = {};
