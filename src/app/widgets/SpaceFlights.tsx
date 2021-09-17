import React from 'react';
import { useAPI } from 'app/hooks';
import { Vector2 } from 'app/utils/Vector2';
import { defineMessages, FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Panel from 'app/components/Panel';
import { WidgetProps, WidgetType } from 'app/Widget';
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

	const locale = intl.locale == "en" ? undefined : intl.locale;
	const day = Number.parseInt(ret[2]);
	if (day <= 31) {
		const date = new Date(`${day} ${ret[1]} 2021`);
		return date.toLocaleString(locale, { day: "numeric", month: "short" });
	} else {
		const date = new Date(`1 ${ret[1]} 2021`);
		return date.toLocaleString(locale, { month: "short" });
	}
}


function SpaceFlights(widget: WidgetProps<any>) {
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
						<div className="col one-line text-muted">
							{launch.provider}
						</div>
						<div className="col-auto float-right text-muted"
								title={winOpen ? intl.formatDate(winOpen,
									{ dateStyle: "medium", timeStyle: "short" }) : undefined}>
							{renderDate(intl, launch)}
						</div>
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


const widget: WidgetType<Record<string, never>> = {
	Component: SpaceFlights,
	title: messages.title,
	description: messages.description,
	editHint: messages.editHint,
	defaultSize: new Vector2(5, 4),
	initialProps: {},
	schema: {},
};
export default widget;
