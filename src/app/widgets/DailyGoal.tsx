import AutoWidthInput from "app/components/AutoWidthInput";
import { useWidgetProp } from "app/hooks/widget";
import Schema from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps } from "app/Widget";
import React, { ChangeEvent, useEffect } from "react";


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

	return (
		<div className="text-shadow-hard large middle-center">
			<AutoWidthInput onChange={handleChange} value={goal?.text ?? ""}
					placeholder="What's your goal for today?" />

			{goal &&
				(<a onClick={() => setGoal(undefined)} className="btn btn-sm ml-2">
					<i className="fas fa-times" />
				</a>)}
		</div>);
}


DailyGoal.description = "Reminds you about a daily goal";

DailyGoal.editHint = "You can change the goal by clicking it on the widget";

DailyGoal.initialProps = {};

DailyGoal.schema = {} as Schema;

DailyGoal.defaultSize = new Vector2(15, 1);
