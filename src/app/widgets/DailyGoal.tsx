import AutoWidthInput from "app/components/AutoWidthInput";
import Button, { ButtonVariant } from "app/components/Button";
import Panel from "app/components/Panel";
import useWidgetProp from "app/hooks/useWidgetProp";
import { miscMessages } from "app/locale/common";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetType } from "app/Widget";
import React, { ChangeEvent, useEffect } from "react";
import { defineMessages, useIntl } from "react-intl";


const messages = defineMessages({
	title: {
		defaultMessage: "Daily Goal",
		description: "Daily Goal Widget",
	},

	description: {
		defaultMessage: "Reminds you about a daily goal",
		description: "Daily Goal widget description",
	},

	editHint: {
		defaultMessage: "You can change the goal by clicking it on the widget",
		description: "Daily Goal widget: edit modal hint"
	},

	placeholder: {
		defaultMessage: "What's your goal for today?",
		description: "Daily Goal prompt",
	},
});

interface Goal {
	text: string;
	time: Date;
}

interface DailyGoalProps {
	goal?: Goal;
}


function DailyGoal(widget: WidgetProps<DailyGoalProps>) {
	const [goal, setGoal] = useWidgetProp<Goal | undefined>(widget, "goal");

	useEffect(() => {
		if (goal && goal.time.getDate() != new Date().getDate()) {
			setGoal(undefined);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
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
			<div className="large middle-center">
				<AutoWidthInput onChange={handleChange} value={goal?.text ?? ""}
						placeholder={intl.formatMessage(messages.placeholder)} />

				{goal &&
					(<Button small={true} className="ml-2" icon="fas fa-times"
							variant={ButtonVariant.None}
							title={miscMessages.delete}
							onClick={() => setGoal(undefined)} />)}
			</div>
		</Panel>);
}


const widget: WidgetType<DailyGoalProps> = {
	Component: DailyGoal,
	title: messages.title,
	description: messages.description,
	editHint: messages.editHint,
	defaultSize: new Vector2(15, 1),
	initialProps: {},
	schema: {},
	initialTheme: {
		showPanelBG: false,
	},
};
export default widget;
