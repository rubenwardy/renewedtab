import AutoWidthInput from "app/components/AutoWidthInput";
import { useStorage } from "app/hooks";
import Schema from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import React, { ChangeEvent, useEffect } from "react";


interface Goal {
	text: string;
	time: Date;
}


export default function DailyGoal() {
	const [goal, setGoal] = useStorage<Goal | null>("goal");

	useEffect(() => {
		if (goal && goal.time.getDate() != new Date().getDate()) {
			setGoal(null);
		}
	}, []);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.value == "") {
			setGoal(null);
		} else {
			setGoal({
				text: e.target.value,
				time: new Date(),
			});
		}
	}

	return (
		<div className="text-shadow-hard large middle-center">
			{goal !== undefined &&
				<AutoWidthInput onChange={handleChange} value={goal?.text ?? ""}
						placeholder="What's your goal for today?" />}

			{goal &&
				(<a onClick={() => setGoal(null)} className="btn btn-sm ml-2">
					<i className="fas fa-times" />
				</a>)}
		</div>);
}


DailyGoal.description = "Reminds you about a daily goal";

DailyGoal.editHint = "You can change the goal by clicking it on the widget";

DailyGoal.initialProps = {};

DailyGoal.schema = {} as Schema;

DailyGoal.defaultSize = new Vector2(15, 1);
