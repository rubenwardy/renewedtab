import BackgroundStore, { BackgroundMode, BackgroundModeType, getDescriptionForMode } from "app/BackgroundStore";
import React, { useState } from "react";
import { Radio, RadioGroup } from "react-radio-group";
import { Form } from "./forms";

export default function BackgroundSettings(props: { background: BackgroundStore }) {
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

	return (
		<div className="modal-body">
			<h3>Background Type</h3>
			<RadioGroup name="mode" selectedValue={BackgroundMode[mode]} onChange={handleModeChanged}>
				{radioModes}
			</RadioGroup>
			<h3>{`${BackgroundMode[mode]} Options`}</h3>
			<Form
				values={background.getValues()}
				schema={background.getSchema()}
				onChange={background.setValue} />
		</div>);
}
