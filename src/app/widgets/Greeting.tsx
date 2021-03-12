import AutoWidthInput from "app/components/AutoWidthInput";
import { useStorage } from "app/hooks";
import Schema from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import React, { ChangeEvent } from "react";


function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) {
		return "Good morning";
	} else if (hour < 16) {
		return "Good afternoon";
	} else {
		return "Good evening";
	}
}


export default function Greeting() {
	const [name, setName] = useStorage<string | undefined>("name", undefined, []);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setName(e.target.value);
	}

	return (
		<div className="text-shadow-hard large text-center">
			{getGreeting()},&nbsp;
			{name !== undefined &&
				<AutoWidthInput onChange={handleChange} value={name ?? ""}
						placeholder="name" />}
		</div>);
}


Greeting.description = "Greets you";

Greeting.initialProps = {};

Greeting.schema = {} as Schema;

Greeting.defaultSize = new Vector2(15, 1);
