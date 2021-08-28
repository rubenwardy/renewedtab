import React from 'react';
import { useAPI } from 'app/hooks';
import { Vector2 } from 'app/utils/Vector2';
import Schema from 'app/utils/Schema';
import { defineMessages, FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Panel from 'app/components/Panel';
import { WidgetProps } from 'app/Widget';
import ErrorView from 'app/components/ErrorView';
import SpaceLaunch from 'common/api/SpaceLaunch';


const messages = defineMessages({
	title: {
		defaultMessage: "Space Flights",
		description: "Space Flights Widget",
	},

	description: {
		defaultMessage: "A list of upcoming space launches, powered by RocketLaunch.Live",
		description: "SpaceFlights widget description",
	},

	editHint: {
		defaultMessage: "Powered by RocketLaunch.Live",
		description: "SpaceFlights widget: edit modal hint",
	},

	today: {
		defaultMessage: "Today, {time}",
		description: "SpaceFlights widget: today and time",
	}
});


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

function isSameDay(one?: Date, two?: Date): boolean {
	return one != undefined && two != undefined &&
			one.getFullYear() === two.getFullYear() &&
			one.getMonth() === two.getMonth() &&
			one.getDate() === two.getDate();
}

function attemptDate(str: (string | null)): (Date | null) {
	const utc = Date.parse(str ?? "");
	return utc ? new Date(utc) : null;
}

function renderDate(intl: IntlShape, launch: SpaceLaunch): string {
	const winOpen = attemptDate(launch.win_open);
	if (winOpen) {
		const winOpenDate = new Date(winOpen);
		if (isSameDay(winOpenDate, new Date())) {
			const time = intl.formatTime(winOpenDate, {
				hour: "numeric",
				minute: "numeric",
				second: undefined,
				hourCycle: false ? "h12" : "h23",
			});

			return intl.formatMessage(messages.today, { time });
		}
	}

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
	const intl = useIntl();
	const [data, error] = useAPI<SpaceLaunch[]>("space-flights/", {}, []);
	if (!data) {
		return (<ErrorView error={error} loading={true} />);
	}

	const rows = data.map(launch => {
		const winOpen = attemptDate(launch.win_open);
		const isToday = isSameDay(new Date(), winOpen ?? undefined);
		return (
			<li key={launch.id}>
				<a href={launch.link}>
					<div>
						{launch.name}
						{isToday && " 🚀"}
					</div>
					<div className="row">
						<span className="col one-line text-muted">
							{launch.provider}
						</span>
						<span className="col-auto float-right text-muted"
								title={winOpen ? intl.formatDate(winOpen,
									{ dateStyle: "medium", timeStyle: "short" }) : undefined}>
							{renderDate(intl, launch)}
						</span>
					</div>
				</a>
			</li>);
	});

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


SpaceFlights.title = messages.title;
SpaceFlights.description = messages.description;

SpaceFlights.editHint = messages.editHint;

SpaceFlights.initialProps = {};

SpaceFlights.schema = {} as Schema;

SpaceFlights.defaultSize = new Vector2(5, 4);
