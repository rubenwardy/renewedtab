import React from 'react';
import { useAPI } from 'app/hooks';
import { Vector2 } from 'app/utils/Vector2';
import Schema from 'app/utils/Schema';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import Panel from 'app/components/Panel';
import { WidgetProps } from 'app/Widget';
import ErrorView from 'app/components/ErrorView';


const messages = defineMessages({
	title: {
		defaultMessage: "Space Flights",
	},

	description: {
		defaultMessage: "A list of upcoming space launches, powered by RocketLaunch.Live",
	},

	editHint: {
		defaultMessage: "Powered by RocketLaunch.Live",
	},

	loadingFlights: {
		defaultMessage: "Loading flights...",
	},
});


interface SpaceLaunch {
	id: number;
	name: string;
	link: string;
	provider: string;
	vehicle: string;
	win_open: string | null;
	win_close: string | null;
	date_str: string;
}

function getOrdinal(num: number): string {
	const dec = Math.floor(num / 10);
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

const MonthShortToLong = new Map([
	["jan", "January"], ["feb", "February"], ["mar", "March"], ["apr", "April"],
	["jun", "June"], ["jul", "July"], ["aug", "August"], ["sep", "September"],
	["oct", "October"], ["nov", "November"], ["dec", "December"]
]);

function getDate(launch: SpaceLaunch): string {
	const ret = launch.date_str.match(RegExp(/([A-Za-z]+) ([0-9]+)$/));
	if (!ret) {
		return launch.date_str;
	}

	const day = Number.parseInt(ret[2]);
	const month = MonthShortToLong.get(ret[1].toLowerCase()) ?? ret[1];
	if (day <= 31) {
		return `${day + getOrdinal(day)} ${month}`;
	} else {
		return month;
	}
}


export default function SpaceFlights(widget: WidgetProps<any>) {
	const [data, error] = useAPI<SpaceLaunch[]>("space-flights/", {}, []);
	if (!data) {
		return (<ErrorView error={error} loading={true} />);
	}

	const rows = data.map(launch => (
		<li key={launch.id}>
			<a href={launch.link}>
				{launch.name}<br />
				<span className="text-muted">{launch.provider}</span>
				<span className="float-right text-muted">{getDate(launch)}</span>
			</a>
		</li>));

	return (
		<Panel {...widget.theme} flush={true}>
			<h2 className="panel-inset">
				<FormattedMessage {...messages.title} />
			</h2>
			<ul className="links">
				{rows}
			</ul>
		</Panel>);
}


SpaceFlights.description = messages.description;

SpaceFlights.editHint = messages.editHint;

SpaceFlights.initialProps = {};

SpaceFlights.schema = {} as Schema;

SpaceFlights.defaultSize = new Vector2(5, 4);
