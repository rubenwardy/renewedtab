import Background, { BackgroundMode, BackgroundModeType, getDescriptionForMode, getSchemaForMode } from "app/Background";
import React, { useState } from "react";
import { Radio, RadioGroup } from "react-radio-group";
import { makeField } from "./Field";

export default function BackgroundSettings(props: { background: Background }) {
	const background = props.background;
	const [mode, setMode] = useState(background.getMode());

	const radioModes =
		Object.keys(BackgroundMode)
			.filter(value => isNaN(Number(value)))
			.map(x => (
				<div className="field" key={x}>
					<Radio value={x} />
					{x}:&nbsp;
					<span className="text-muted">
						{getDescriptionForMode(BackgroundMode[x as BackgroundModeType])}
					</span>
				</div>));

	function handleModeChanged(newMode: string) {
		setMode(BackgroundMode[newMode as BackgroundModeType]);
		localStorage.setItem("bg_mode", newMode);
	}

	const schema = getSchemaForMode(mode);
	const inner = Object.entries(schema).map(([key, type]) => {
		const value = background.getValue(key);
		const Field = makeField(type);
		return (
			<Field key={key} name={key} value={value}
				onChange={(val) => background.setValue(key, val)} />);
	});

	if (inner.length == 0) {
		inner.push(
			<p className="text-muted" key="none">
				No options.
			</p>);
	}

	return (
		<div className="modal-body">
			<h3>Background Type</h3>
			<RadioGroup name="mode" selectedValue={BackgroundMode[mode]} onChange={handleModeChanged}>
				{radioModes}
			</RadioGroup>
			<h3>{`${BackgroundMode[mode]} Options`}</h3>
			{inner}
		</div>);
}
