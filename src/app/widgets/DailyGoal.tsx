import AutoWidthInput from "app/components/AutoWidthInput";
import Panel from "app/components/Panel";
import { useWidgetProp } from "app/hooks/widget";
import Schema from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetTheme } from "app/Widget";
import React, { ChangeEvent, useEffect } from "react";
import { defineMessages, useIntl } from "react-intl";


const messages = defineMessages({
	description: {
		defaultMessage: "Reminds you about a daily goal",
	},

	editHint: {
		defaultMessage: "You can change the goal by clicking it on the widget",
	},

	placeholder: {
		defaultMessage: "What's your goal for today?",
	},
});

interface Goal {
	text: string;
	time: Date;
}

interface DailyGoalProps {
	goal?: Goal;
}


export default function DailyGoal(widget: WidgetProps<DailyGoalProps>) {
	const [goal, setGoal] = useWidgetProp<Goal | undefined>(widget, "goal");

	useEffect(() => {
		if (goal && goal.time.getDate() != new Date().getDate()) {
			setGoal(undefined);
		}
	}, []);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.value == "") {
			setGoal(undefined);
		} else {
			setGoal({
				text: e.target.value,
				time: new Date(),
			});
		}
	}

	const intl = useIntl();
	return (
		<Panel {...widget.theme}>
			<div className="text-shadow-hard large middle-center">
				<AutoWidthInput onChange={handleChange} value={goal?.text ?? ""}
						placeholder={intl.formatMessage(messages.placeholder)} />

				{goal &&
					(<a onClick={() => setGoal(undefined)} className="btn btn-sm ml-2">
						<i className="fas fa-times" />
					</a>)}
			</div>
		</Panel>);
}


DailyGoal.description = messages.description;

DailyGoal.editHint = messages.editHint;

DailyGoal.initialProps = {};

DailyGoal.schema = {} as Schema;

DailyGoal.defaultSize = new Vector2(15, 1);

DailyGoal.initialTheme = {
	showPanelBG: false,
} as WidgetTheme;
